
function BFGraphViewPlugin(api_url) {
    return function install(openmct) {

        openmct.types.addType('bf-graphview', {
            name: 'BF - Graph View',
            description: '',
            creatable: true
        });

        openmct.objectViews.addProvider({
            name: "orthanc-provider",
            key: "bf-graphview",
            cssClass: "icon-packet",
            canView: function (d) {
                return d.type === 'bf-graphview';
            },
            view: function (domainObject) {
                var vm;

                return {
                    show: function (container) {

                        PubSub.subscribe(BF_EX_TRANSVERSAL, function(name, exchange_trns_id){
                            $(container).html('');

                            $.getJSON(api_url + 'bf_transversal_graph/'+exchange_trns_id+'/', function(data) {
                                window.Graph = ForceGraph()
                                (container)
                                    .width($(container).width())
                                    .height($(container).height())
                                    .backgroundColor('#101010')
                                    .linkColor(() => 'rgba(255,255,255,0.1)')
                                    .nodeColor(() => 'rgba(8, 164, 186, 0.2)')
                                    .graphData(data['data'])
                                    .nodeId('id')
                                    .nodeVal('val')
                                    .nodeLabel('id')
                                    .nodeAutoColorBy('group')
                                    .linkSource('source')
                                    .linkTarget('target')
                                    .linkDirectionalParticleColor(() => 'rgba(8, 164, 186, 1.0)')
                                    .linkDirectionalParticleSpeed(0.025)
                                    .onNodeDragEnd(node => {
                                      node.fx = node.x;
                                      node.fy = node.y;
                                    }).zoom(1, 1000);
                            });
                        });


                    },
                    destroy: function (container) {
                        //vm.$destroy();
                    }
                };
            }
        });
    };
};