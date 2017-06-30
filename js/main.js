$(function () {

    function renderElement(name, data) {
        var template = LaptiTemplates[name],
            string = template(data);
        return $(string);
    }

    function initPlugin() {
        var lapti = $('#lapti'),
            container = renderElement('container');
        lapti.append(container);
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
            modal.modal();
            $('.modal-backdrop').appendTo(plugin);
            $('body').removeClass('modal-open').css({ paddingRight: 0 });
        });

        submit.on('click', function () {
            // TODO : renderIcoDashboard
            modal.modal('hide'); // TODO : replace with loading and rendering the next chunk
        });

        return join;

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

    function renderIcoDashboard(ico) {}

    function renderPostIco(ico) {}

    var plugin = initPlugin(),
        icoId = plugin.data('id');

    Lapti.setApiAddress('http://localhost:91058');

    // Lapti.ico.getDetails(icoID).then(whatToRender);
    Promise.resolve({
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
            collected: 22000
        }, {
            name: 'btc',
            collected: 0
        }],
        target_chain: 'waves'
    }).then(whatToRender);

});