
function BFOrderBookPlugin(api_url) {
    return function install(openmct) {

        openmct.types.addType('bf-orderbook', {
            name: 'BF - OrderBook',
            description: '',
            creatable: true
        });

        openmct.objectViews.addProvider({
            name: "orthanc-provider",
            key: "bf-orderbook",
            cssClass: "icon-packet",
            canView: function (d) {
                return d.type === 'bf-orderbook';
            },
            view: function (domainObject) {
                var vm;

                return {
                    show: function (container) {

                        PubSub.subscribe(BF_ORDERBOOK, function(name, pathview_id){

                            $(container).html('<div class="loader">Loading...</div>');

                            var html = '';
                            $.getJSON(api_url + 'bf_orderbook/'+pathview_id+'/', function(data) {
                                console.log(data);

                                $.each(data.data, function(idx, pair_data){
                                    html += 'Pair: ' + pair_data['pair'];

                                    html += '<table class="c-table c-lad-table">';
                                    html += '<thead>';
                                    html += '<tr>';
                                    html += '  <th>Bid</th>';
                                    html += '  <th>Ask</th>';
                                    html += '</tr>';
                                    html += '<tbody>';
                                    for(var i=0; i<=19; i++) {

                                        html += ' <tr>';

                                        html += '  <td>';
                                            if(Array.isArray(pair_data['bids'][i])) {
                                                html += pair_data['bids'][i].join(' , ');
                                            }
                                            else {
                                                html += ' - ';
                                            }
                                        html += '  </td>';
                                        html += '  <td>';
                                            if(Array.isArray(pair_data['asks'][i])) {
                                                html += pair_data['asks'][i].join(' , ');
                                            }
                                            else {
                                                html += ' - ';
                                            }
                                        html += '  </td>';

                                        html += ' </tr>';

                                    }
                                    html += '</tbody>';
                                    html += '</table>';
                                });

                                $(container).html(html);
                                $(container).css('overflow', 'auto');
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