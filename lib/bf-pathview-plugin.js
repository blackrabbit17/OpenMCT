function BFPathViewPlugin(api_url) {
    return function install(openmct) {

        openmct.types.addType('bf-pathview', {
            name: 'BF - Path View',
            description: '',
            creatable: true
        });

        openmct.objectViews.addProvider({
            name: "orthanc-provider",
            key: "bf-pathview",
            cssClass: "icon-packet",
            canView: function (d) {
                return d.type === 'bf-pathview';
            },
            view: function (domainObject) {
                var vm;
                var current_transversal_id = null;

                return {
                    show: function (container) {
                        PubSub.subscribe(BF_EX_TRANSVERSAL, function(name, exchange_trns_id) {

                            current_transversal_id = exchange_trns_id;
                            $(container).html('');

                            $.getJSON(api_url + 'bf_path/'+exchange_trns_id+'/', function(data) {
                                                            var table = `
    <div class="c-lad-table-wrapper u-style-receiver js-style-receiver">
        <table class="c-table c-lad-table">
            <thead>
                <tr>
                    <th>Hop</th>
                    <th>Enabled</th>
                    <th>SRC</th>
                    <th>DST</th>
                    <th>Rate</th>
                    <th>Resulting</th>
                </tr>
            </thead>
            <tbody>
                ||
            </tbody>
        </table>
        <button id='bf_fetch_orderbook' style="margin:10px;" class="c-button c-button--major">Fetch OrderBook</button>

    </div>
    `;
                                var row_html = '';
                                $.each(data['data'], function(idx, run){
                                    row_html += '<tr class="bf-path-tr" data-id="'+run['id']+'">';
                                        row_html += '<td>' + run['hop'] + '</td>';

                                        if(run['market_enabled'] == null) {
                                            row_html += '<td>-</td>';
                                        }
                                        else if(run['market_enabled'] == false) {
                                            row_html += '<td>&#x2717;</td>';
                                        }
                                        else if(run['market_enabled'] == true) {
                                            row_html += '<td>&#x2714;</td>';
                                        }
                                        else {
                                            row_html += '<td>?</td>';
                                        }

                                        row_html += '<td>' + run['src_symbol'] + '</td>';
                                        row_html += '<td>' + run['dst_symbol'] + '</td>';
                                        row_html += '<td>' + run['rate'] + '</td>';
                                        row_html += '<td>' + run['resulting_amount'] + '</td>';
                                    row_html += '</tr>';
                                });
                                $(container).append(table.replace('||', row_html));

                                $('#bf_fetch_orderbook').click(function(){
                                    PubSub.publish(BF_ORDERBOOK, current_transversal_id);
                                });
                            });

                            // Testing

                        });
                    },
                    destroy: function (container) {
                    }
                };
            }
        });
    };
};