window.debug = null;

function generate_correlation_image(c_matrix, container) {
    var width = Object.keys(c_matrix).length;
    var height = width;
    var buffer = new Uint8ClampedArray(width * height * 4);

    var color_func = chroma.scale('YlGnBu').domain([-1, 1]).nodata('#0000').padding(0.3);

    $.each(Object.keys(c_matrix), function(y, key){

        $.each(Object.keys(c_matrix[key]), function(x, correlation){
            var pos = (y * width + x) * 4; // position in buffer based on x and y

            var color = color_func(c_matrix[key][correlation]).rgba();

            buffer[pos  ] = color[0];           // some R value [0, 255]
            buffer[pos+1] = color[1];           // some G value
            buffer[pos+2] = color[2];           // some B value

            if(color[3] == 1) {
                buffer[pos+3] = 255;
            }
            else {
                buffer[pos+3] = 0;
            }
        });
    });

    // create off-screen canvas element
    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;

    var idata = ctx.createImageData(width, height);

    idata.data.set(buffer);

    ctx.putImageData(idata, 0, 0);

    $(container).html('');
    $(container).append(canvas);

    $(canvas).css('image-rendering', 'pixelated');
    $(canvas).css('margin', '0 9px');
    $(container).css('overflow', 'auto');

    function pixloc(ev) {
      var x = ev.layerX;
      var y = ev.layerY;
      var pixeldata = ctx.getImageData(x, y, 1, 1);
      var col = pixeldata.data;
      console.log(x, y, pixeldata, col);
    }
    canvas.addEventListener('mousemove', pixloc, false);
}


function SpotMatrixPlugin(api_url) {
    return function install(openmct) {

        openmct.types.addType('spotmatrix', {
            name: 'Spot Matrix',
            description: '',
            creatable: true
        });

        openmct.objectViews.addProvider({
            name: "orthanc-provider",
            key: "spotmatrix",
            cssClass: "icon-packet",
            canView: function (d) {
                return d.type === 'spotmatrix';
            },
            view: function (domainObject) {
                var vm;

                return {
                    show: function (container) {

                        console.log('spot matrix');
                         $.getJSON(api_url + 'spot_matrix/100/', function(response) {
                            console.dir(response);
                            window.debug = response;
                            generate_correlation_image(response.data, container);
                         });

                    },
                    destroy: function (container) {

                    }
                };
            }
        });
    };
};