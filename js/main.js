$(function () {

    function renderElement(name, data) {
        var template = LaptiTemplates[name],
            string = template(data);
        return $(string);
    }

    // Render modal within the plugin
    function hackModal(modal) {
        modal.modal();
        $('.modal-backdrop').appendTo(plugin);
        $('body').removeClass('modal-open').css({ paddingRight: 0 });
    }

    // ELEMENTS

    function getCurrencyElement(ico) {
        return renderElement('currency', {
            currency: LaptiData.extendCurrency(ico.blockchains),
            usd: ico.usd_collected
        });
    }

    function getJoinElement(ico) {

        var title = LaptiData.getCurrencyTitle(ico.target_chain),
            join = renderElement('join', { title: title }),
            button = join.find('.join-button'),
            modal = join.find('.join-modal'),
            input = join.find('.join-address'),
            submit = join.find('.join-submit');

        button.on('click', function () {
            hackModal(modal);
            modal.on('shown.bs.modal', function () {
                input.focus();
            });
        });

        submit.on('click', function () {
            var address = input.val(),
                spinner = renderElement('spinner');
            // TODO : validate address
            modal.find('.modal-footer').empty().append(spinner);
            mockJoinIco(address).then(function (data) {
                modal.on('hidden.bs.modal', function () {
                    renderIcoDashboard(data);
                }).modal('hide');
            });
        });

        return join;

    }

    function getBlockchainsTableElement(data) {

        var addresses = LaptiData.extendAddresses(data.addresses),
            table = renderElement('blockchains-table', { addresses: addresses }),

            backButton = table.find('.back-button'),
            qrButton = table.find('.qr-button'),
            qrModal = table.find('.qr-modal'),
            qrCanvas = qrModal.find('.qr-canvas'),

            qr = new QRious({
                element: qrCanvas.get(0),
                size: 200
            });

        // TODO : request separate addresses

        // TODO : copy to clipboard

        backButton.on('click', function () {
            plugin.empty();
            plugin.append(renderElement('spinner'));
            mockGetIcoStatus().then(whatToRender);
        });

        qrButton.on('click', function () {
            qr.value = $(this).data('address');
            hackModal(qrModal);
        });

        return table;

    }

    // INITIALIZATION

    function initPlugin() {
        var lapti = $('#lapti'),
            container = renderElement('container');
        lapti.append(container);
        // lapti.on('click', 'a[href="#"]', false); // TODO : decide
        return container;
    }

    function whatToRender(ico) {
        var now = Date.now();
        if (ico.time_start < now) {
            // renderPreIco(ico);
            renderIcoPreview(ico); // FIXME
        } else if (now > ico.time_end) {
            renderPostIco(ico);
        } else {
            renderIcoPreview(ico);
        }
    }

    function renderPreIco(ico) {
        var countdown = renderElement('countdown'),
            currency = getCurrencyElement(ico);
        plugin.empty();
        plugin.append(countdown);
        plugin.append(currency);
    }

    function renderIcoPreview(ico) {
        var join = getJoinElement(ico),
            currency = getCurrencyElement(ico);
        plugin.empty();
        plugin.append(join);
        plugin.append(currency);
    }

    function renderIcoDashboard(data) {
        var blockchains = getBlockchainsTableElement(data);
        plugin.empty();
        plugin.append(blockchains);
    }

    function renderPostIco(ico) {}

    var plugin = initPlugin(),
        icoId = plugin.data('id');

    plugin.append(renderElement('spinner'));

    Lapti.setApiAddress('http://localhost:91058');

    // MOCK FUNCTIONS

    mockGetIcoStatus().then(whatToRender);

    // Lapti.ico.getDetails(icoID).then(whatToRender);
    function mockGetIcoStatus() {
        return delay({
            ico_id: 12345,
            ico_name: 'Test ICO',
            time_start: 1497891624328,
            time_end: 1497951624328,
            usd_minimum: 100000,
            usd_maximum: 2500000,
            usd_collected: 199366,
            scheme: 'fixed-price',
            blockchains: [{
                name: 'waves',
                collected: 2342
            }, {
                name: 'btc',
                collected: 253
            }],
            target_chain: 'waves'
        });
    }

    function mockJoinIco(address) {
        return delay({
            addresses: [{
                name: 'waves',
                address: '3PPcVBAuC5F829PCcS4JqHAdF119Lt7mR7q'
            }, {
                name: 'btc',
                address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2'
            }]
        });
    }

    function delay(data) {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve(data);
            }, 200);
        });
    }

});