function BFExchangeTransversalPlugin(api_url) {
    return function install(openmct) {

        openmct.types.addType('bf-exchange-transversal', {
            name: 'BF - Exchange Transversal',
            description: '',
            creatable: true
        });

        openmct.objectViews.addProvider({
            name: "orthanc-provider",
            key: "bf-exchange-transversal",
            cssClass: "icon-packet",
            canView: function (d) {
                return d.type === 'bf-exchange-transversal';
            },
            view: function (domainObject) {
                var vm;

                return {
                    show: function (container) {

                        PubSub.subscribe(BF_EXCHANGERUN, function(name, exchange_run_id){
                            $(container).html('');
                            var table = `
    <div class="c-lad-table-wrapper u-style-receiver js-style-receiver">
        <table class="c-table c-lad-table">
            <thead>
                <tr>
                    <th>Exchange</th>
                    <th>Computed At</th>
                    <th>w</th>
                    <th>all(&#x2714;)</th>
                    <th>Projected Profit %</th>
                    <th>Traded</th>
                </tr>
            </thead>
            <tbody>
                ||
            </tbody>
        </table>
    </div>
    `;

                            var row_html = '';
                            $.getJSON(api_url + 'bf_exchange_transversal/'+exchange_run_id+'/', function(data) {
                                $.each(data['data'], function(idx, run){
                                    row_html += '<tr class="bf-tr" data-id="'+run['id']+'">';
                                        row_html += '<td>' + run['exchange']['name'] + '</td>';
                                        row_html += '<td>' + run['computed_at'] + '</td>';
                                        row_html += '<td>' + run['path_length'] + '</td>';

                                        if(run['all_markets_enabled'] == null) {
                                            row_html += '<td>-</td>';
                                        }
                                        else if(run['all_markets_enabled'] == false) {
                                            row_html += '<td>&#x2717;</td>';
                                        }
                                        else if(run['all_markets_enabled'] == true) {
                                            row_html += '<td>&#x2714;</td>';
                                        }
                                        else {
                                            row_html += '<td>?</td>';
                                        }

                                        row_html += '<td>' + run['projected_profit_pct'] + '</td>';
                                        row_html += '<td>' + run['traded'] + '</td>';
                                    row_html += '</tr>';

                                });
                                $(container).append(table.replace('||', row_html));
                                $('.bf-tr').on('click', function(event){
                                    event.stopPropagation();
                                    event.stopImmediatePropagation();

                                    $('.bf-tr').removeClass('bf-tr-selected');
                                    $(event.srcElement.parentNode).addClass('bf-tr-selected');

                                    var ex_run_id = $(event.srcElement.parentNode).attr('data-id');
                                    PubSub.publish(BF_EX_TRANSVERSAL, ex_run_id);
                                });
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