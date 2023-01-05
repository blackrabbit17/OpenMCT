function BFExchangeRunPlugin(api_url) {
    return function install(openmct) {

        openmct.types.addType('bf-exchangerun', {
            name: 'BF - Exchange Run',
            description: '',
            creatable: true
        });

        openmct.objectViews.addProvider({
            name: "orthanc-provider",
            key: "bf-exchangerun",
            cssClass: "icon-packet",
            canView: function (d) {
                return d.type === 'bf-exchangerun';
            },
            view: function (domainObject) {
                var vm;

                return {
                    show: function (container) {
                $(container).html('');

                                        var table = `
<div class="c-lad-table-wrapper u-style-receiver js-style-receiver">
    <table class="c-table c-lad-table">
        <thead>
            <tr>
                <th>Timestamp</th>
                <th>&gt; 0</th>
                <th>== 0</th>
                <th>Err</th>
            </tr>
        </thead>
        <tbody>
            ||
        </tbody>
    </table>
</div>
`;
                        var row_html = '';
                        $.getJSON(api_url + 'bf_exchange_run/?limit=50', function(data) {
                            $.each(data['data'], function(idx, run){
                                row_html += '<tr class="bf-exr-tr" data-id="'+run['id']+'">';
                                    row_html += '<td>' + run['started_at'] + '</td>';
                                    row_html += '<td>' + run['ex_path_discovered'] + '</td>';
                                    row_html += '<td>' + run['ex_no_path'] + '</td>';
                                    row_html += '<td>' + run['ex_exceptions'] + '</td>';
                                row_html += '</tr>';

                            });

                            $(container).append(table.replace('||', row_html));
                            $(container).css('overflow', 'auto');

                            $('.bf-exr-tr').on('click', function(event){
                                event.stopPropagation();
                                event.stopImmediatePropagation();

                                $('.bf-exr-tr').removeClass('bf-exr-tr-selected');
                                $(event.srcElement.parentNode).addClass('bf-exr-tr-selected');

                                var ex_run_id = $(event.srcElement.parentNode).attr('data-id');
                                PubSub.publish(BF_EXCHANGERUN, ex_run_id);
                            });
                        });
                    },
                    destroy: function (container) {

                    }
                };
            }
        });
    };
};