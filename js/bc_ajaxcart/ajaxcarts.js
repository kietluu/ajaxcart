/**
 * Created by AnhKiet on 10/26/15.
 */
var win;
var ajaxLoader = "<div id='loader' style='border: 1px #999999 solid; position: fixed; text-align: center; background-color: #ffffff; z-index: 9999; color: black; overflow: auto; min-height: 50px; min-width: 260px; display:none; margin: 50px; left: 43%; top: 40%; padding: 25px; width: auto; height: auto; margin-left: auto; margin-right: auto;'>" +
    "<img id='loaderGif' src='/skin/frontend/base/default/images/bc_ajaxcart/ajax-loader-black.gif'><p style='font: 12px/1.55 Arial, Helvetica, sans-serif;'>Please wait...</p></div>" +
    "<div id='acoverlay' style='display:none;position: fixed;top: 0;left: 0;width: 100%;height: 100%;background-color: #000;-moz-opacity: 0.3;opacity: .30;filter: alpha(opacity=30);z-index: 9990;'></div>";

jQuery(document).ready(function () {
    jQuery("body").append(ajaxLoader);

    //change view button to cart button
    jQuery(".category-products a.button").prop("title", "Add to Cart");
    jQuery(".category-products a.button").text("Add to Cart");

    win = new Window({
        id: "alphacube",
        className: "alphacube",
        title: "Please, choose product options",
        minWidth: 398,
        minHeight: 490,
        maxHeight: 1200,
        maxWidth: 1200,
        closable: true,
        minimizable: false,
        maximizable: false,
        resizable: false,
        draggable: false,
        onClose: closeAc,
        showEffect: Element.show,
        hideEffect: Element.hide
    });

    //view button (change on add to cart label)
    jQuery(document).on('click', ".category-products a.button", function (event) {
        event.preventDefault();
        addToCart(this.href);
    });
    //remove onclick attribute, save value
    jQuery.each(jQuery(".category-products .btn-cart"), function (k, v) {
        var onclick = v.onclick.toString();
        var url = onclick.substring(onclick.lastIndexOf('\''), onclick.indexOf('\'') + 1);
        v.value = url;
        jQuery(v).attr('onclick', '');
    });

    //add to cart from category
    jQuery(document).on('click', ".category-products .btn-cart", function () {
        addToCart(this.value);
    });
});

function addToCart(url) {
    showProcessing();
    url = url.replace("checkout/cart", "ajaxcarts/index");
    if (url.indexOf('ajaxcarts/index') == -1) {
        url = getBaseUrl() + "/ajaxcarts/index/add?url=" + url;
    }
    jQuery.ajax({
        url: url,
        dataType: 'json',
        success: function (data) {
            console.log(data);
            hideProcessing();
            setAjaxData(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('jqXHR:');
            console.log(jqXHR);
            console.log('textStatus:' + textStatus);
            console.log('errorThrown:' + errorThrown);
        }
    });
};

function showProcessing() {
    jQuery('#acoverlay').show();
    jQuery('#loader').show();
};
function hideProcessing() {
    jQuery('#acoverlay').hide();
    jQuery('#loader').hide();
};


function setAjaxData(data) {
    if (data.status == 'ERROR') {
        alert(data.message);
    } else {
        jQuery('#acoverlay').show();
        //if response with option
        if (data.options_url) {
            win.setURL(data.options_url);
            var na = navigator.userAgent;
            var selector_iframe = jQuery("#alphacube iframe");
            if (na.toLowerCase().indexOf('firefox') > -1) {
                selector_iframe.attr('scrolling', 'yes');
            }
            if (na.indexOf('MSIE') != -1) {
                selector_iframe.attr('scrolling', 'yes');
            }
            if (na.indexOf('Chrome') != -1) {
                selector_iframe.attr('scrolling', 'no');
            }
        }
        if (jQuery('.header-minicart .count')) {
            jQuery('.header-minicart .count').text(data.countCart);
            jQuery('.header-minicart .count').show();
        }
        //if show product info enable
        if (data.productinfo) {
            if (jQuery('#choice').length) {
                jQuery('#choice').remove();
            }
            jQuery('.col-main').append(data.productinfo);
            ajaxshow();
        }
    }
}

function showPopup() {
    jQuery('#popupcart').show();
}
function closePopup() {
    jQuery('#popupcart').hide();
}

function closeAc() {
    cancelTimeOut = 1;
    jQuery('#ajaxcart').hide();
    hideProcessing();
    win.setHTMLContent("");
};
function acLoad() {
    var frame = document.getElementById(win.getId());
    frame.style.zIndex = "9995";
    win.showCenter();
    Event.observe("#acoverlay", 'click', respondToClick);
    hideProcessing();
};


function ajaxshow() {
    win.hide();
    showChoice();
};
function respondToClick() {
    cancelTimeOut = 1;
    if (!redirect_timeout > 0) {
        cancelTimeOut = 1;
    }
    closeAc();
    win.close();
};

function showChoice() {
    cancelTimeOut = 0;
    Event.observe("acoverlay", 'click', respondToClick);
    jQuery('#loader').hide();
    jQuery('#choice').show();
    jQuery('#acoverlay').show();
};