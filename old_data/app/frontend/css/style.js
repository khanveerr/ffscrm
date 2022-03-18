import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "html": {
        "fontFamily": "'Open Sans', sans-serif"
    },
    "nav-wrapper": {
        "backgroundColor": "#fee11f"
    },
    "cardsmall card-content": {
        "maxHeight": "100%"
    },
    "cardmedium card-content": {
        "maxHeight": "100%"
    },
    "cardlarge card-content": {
        "maxHeight": "100%"
    },
    "cardservice-card": {
        "paddingTop": 8
    },
    "cardservice-card card-content card-title": {
        "lineHeight": 35,
        "fontSize": 18,
        "fontWeight": "800"
    },
    "cardsmall services": {
        "paddingTop": 0,
        "paddingRight": 10,
        "paddingBottom": 10,
        "paddingLeft": 10,
        "height": 200
    },
    "mycard cardsmall": {
        "height": "auto",
        "minHeight": 50
    },
    "filter-card cardsmall": {
        "height": "auto !important",
        "paddingTop": 10,
        "paddingRight": 10,
        "paddingBottom": 0,
        "paddingLeft": 10
    },
    "filter-card": {
        "paddingTop": 10,
        "paddingRight": 10,
        "paddingBottom": 0,
        "paddingLeft": 10,
        "marginBottom": 0
    },
    "cardsmall carouselcarousel-slider": {
        "height": 131,
        "cursor": "pointer"
    },
    "cardsmall services p": {
        "fontSize": 13
    },
    "cardsmall services p strong": {
        "fontSize": 18,
        "fontWeight": "700"
    },
    "cardsmall": {
        "height": 210
    },
    "spanbadge": {
        "color": "#FFFFFF"
    },
    "cardsmall services p spanbadge": {
        "color": "#ffffff",
        "right": 10,
        "borderRadius": 2,
        "position": "relative",
        "top": 5,
        "cursor": "pointer"
    },
    "lead_services spanbadge": {
        "position": "relative",
        "right": 0,
        "cursor": "pointer"
    },
    "show_lead_stage_modal spanbadge": {
        "position": "relative",
        "right": 0,
        "cursor": "pointer",
        "marginLeft": 10,
        "float": "right"
    },
    "margin-top-0": {
        "marginTop": "0px !important"
    },
    "margin-top-10": {
        "marginTop": "10px !important"
    },
    "margin-left-5": {
        "marginLeft": 5
    },
    "margin-top-5": {
        "marginTop": "5px !important"
    },
    "margin-top-15": {
        "marginTop": "15px !important"
    },
    "margin-top-20": {
        "marginTop": "20px !important"
    },
    "margin-right-10": {
        "marginRight": 30
    },
    "pad-left-zero": {
        "paddingLeft": "0px !important"
    },
    "pad-right-zero": {
        "paddingRight": "0px !important"
    },
    "cardsmall services td": {
        "paddingTop": 0,
        "paddingRight": 0,
        "paddingBottom": 0,
        "paddingLeft": 0
    },
    "cardsmall costing td": {
        "fontSize": 12,
        "borderBottom": "1px dashed #e1e1e1",
        "paddingBottom": 3
    },
    "cardsmall deploy > span": {
        "fontSize": 12,
        "display": "block",
        "borderBottom": "1px dashed #000000"
    },
    "border-left-solid": {
        "borderLeft": "1px solid #CCCCCC"
    },
    "collapsible-header": {
        "minHeight": 45
    },
    "collapsible-header h5": {
        "paddingTop": 5,
        "fontSize": 1.4
    },
    "collapsible-header h5new-font": {
        "fontSize": 1
    },
    "collapsible-header h5 span": {
        "fontSize": 12
    },
    "collapsible-header h5 span strong": {
        "fontWeight": "900"
    },
    "collapsible-body strong": {
        "fontWeight": "900"
    },
    "left-sidebar p strong": {
        "fontWeight": "900"
    },
    "right-sidebar p strong": {
        "fontWeight": "900"
    },
    "font-size-14": {
        "fontSize": "14px !important"
    },
    "font-size-12": {
        "fontSize": "12px !important"
    },
    "font-size-10": {
        "fontSize": "11px !important"
    },
    "collapsible-header h5 span img": {
        "float": "left",
        "marginTop": 7,
        "marginRight": 5
    },
    "collapsiblelead_list>li": {
        "marginBottom": 20
    },
    "collapsiblelead_list>li collapsible-header i": {
        "fontSize": 0.9,
        "marginRight": 0.2,
        "lineHeight": 0.9,
        "width": "auto",
        "float": "left !important",
        "display": "inline"
    },
    "collapsiblelead_list>li collapsible-header": {
        "lineHeight": 2
    },
    "collapsiblelead_list>li collapsible-header btn": {
        "fontSize": 0.7,
        "display": "inline",
        "paddingTop": 0.5,
        "paddingRight": 0.5,
        "paddingBottom": 0.5,
        "paddingLeft": 0.5,
        "height": 27,
        "lineHeight": 11,
        "float": "left",
        "marginTop": 10,
        "marginRight": 10
    },
    "collapsibleservices_list>li": {
        "marginTop": 20
    },
    "collapsibleservices_list>li div btn": {
        "paddingTop": 0,
        "paddingRight": 0,
        "paddingBottom": 0,
        "paddingLeft": 15
    },
    "service_body": {
        "paddingBottom": 20
    },
    "service_body p": {
        "paddingBottom": 0
    },
    "collapsible-header i": {
        "float": "right",
        "lineHeight": 2.5
    },
    "collapsible-header a img": {
        "paddingTop": 10,
        "paddingRight": 10,
        "paddingBottom": 10,
        "paddingLeft": 10
    },
    "margin-right-5": {
        "marginRight": 5
    },
    "inline-block": {
        "display": "inline-block"
    },
    "margin-bottom-0": {
        "marginBottom": 0
    },
    "margin-bottom-5": {
        "marginBottom": 5
    },
    "modal_sm": {
        "width": "35%"
    },
    "modal_md": {
        "width": "42%"
    },
    "modal_lg": {
        "width": "72%",
        "maxHeight": "100%",
        "height": "90% !important",
        "top": "5% !important"
    },
    "modal_lg modal-content": {
        "paddingBottom": 0
    },
    "modal_lg input-field": {
        "marginTop": 5
    },
    "modal_lg picker--opened picker__frame": {
        "top": "0%"
    },
    "modal_lg dropdown-content": {
        "maxHeight": 280
    },
    "right-sidebar dropdown-content": {
        "maxHeight": 280,
        "minWidth": 150
    },
    "modal_md dropdown-content li": {
        "minHeight": 32,
        "lineHeight": 1
    },
    "modal_lg dropdown-content li": {
        "minHeight": 32,
        "lineHeight": 1
    },
    "right-sidebar dropdown-content li": {
        "minHeight": 32,
        "lineHeight": 1
    },
    "left-sidebar dropdown-content li": {
        "minHeight": 32,
        "lineHeight": 1
    },
    "vendor_dd dropdown-content li": {
        "minHeight": 32,
        "lineHeight": 1
    },
    "modal_md dropdown-content li>a": {
        "fontSize": 12,
        "lineHeight": 12,
        "paddingTop": 8,
        "paddingRight": 16,
        "paddingBottom": 8,
        "paddingLeft": 16
    },
    "modal_md dropdown-content li>span": {
        "fontSize": 12,
        "lineHeight": 12,
        "paddingTop": 8,
        "paddingRight": 16,
        "paddingBottom": 8,
        "paddingLeft": 16
    },
    "modal_lg dropdown-content li>a": {
        "fontSize": 12,
        "lineHeight": 12,
        "paddingTop": 8,
        "paddingRight": 16,
        "paddingBottom": 8,
        "paddingLeft": 16
    },
    "modal_lg dropdown-content li>span": {
        "fontSize": 12,
        "lineHeight": 12,
        "paddingTop": 8,
        "paddingRight": 16,
        "paddingBottom": 8,
        "paddingLeft": 16
    },
    "right-sidebar dropdown-content li>a": {
        "fontSize": 12,
        "lineHeight": 12,
        "paddingTop": 8,
        "paddingRight": 16,
        "paddingBottom": 8,
        "paddingLeft": 16
    },
    "right-sidebar dropdown-content li>span": {
        "fontSize": 12,
        "lineHeight": 12,
        "paddingTop": 8,
        "paddingRight": 16,
        "paddingBottom": 8,
        "paddingLeft": 16
    },
    "left-sidebar dropdown-content li>a": {
        "fontSize": 12,
        "lineHeight": 12,
        "paddingTop": 8,
        "paddingRight": 16,
        "paddingBottom": 8,
        "paddingLeft": 16
    },
    "left-sidebar dropdown-content li>span": {
        "fontSize": 12,
        "lineHeight": 12,
        "paddingTop": 8,
        "paddingRight": 16,
        "paddingBottom": 8,
        "paddingLeft": 16
    },
    "vendor_dd dropdown-content li>a": {
        "fontSize": 12,
        "lineHeight": 12,
        "paddingTop": 8,
        "paddingRight": 16,
        "paddingBottom": 8,
        "paddingLeft": 16
    },
    "modal_lg textarea": {
        "paddingTop": 0.9,
        "paddingRight": 0,
        "paddingBottom": 0.9,
        "paddingLeft": 0,
        "height": 1.5,
        "minHeight": 1.5
    },
    "filter_client": {},
    "create_client": {},
    "modal-trigger": {
        "cursor": "Pointer"
    },
    "cursor-pointer": {
        "cursor": "Pointer"
    },
    "left-sidebar": {
        "marginTop": 0,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 0
    },
    "right-sidebar": {
        "marginTop": 0,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 0
    },
    "mycard": {
        "marginTop": 0,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 0,
        "paddingTop": "0.8%"
    },
    "my-card-panel": {
        "paddingTop": 0,
        "paddingRight": 10,
        "paddingBottom": 0,
        "paddingLeft": 10
    },
    "amount_table td": {
        "paddingTop": 4,
        "paddingRight": 4,
        "paddingBottom": 4,
        "paddingLeft": 4,
        "fontSize": 0.85
    },
    "mycard i": {
        "fontSize": 15
    },
    "mycard ialert-icon": {
        "fontSize": 28
    },
    "float-none": {
        "float": "none !important"
    },
    "collapsibleservices_list>li div amcbtn": {
        "paddingTop": 0,
        "paddingRight": 15,
        "paddingBottom": 0,
        "paddingLeft": 15,
        "marginRight": 20
    },
    "light-grey": {
        "backgroundColor": "#cecece"
    },
    "display-none": {
        "display": "none"
    },
    "display-block": {
        "display": "block"
    },
    "display-inline": {
        "display": "inline"
    },
    "amc-done-bg-color": {
        "backgroundColor": "#e2e0e0",
        "color": "#b9b2b2"
    },
    "lead-scroll-pane": {
        "overflow": "auto",
        "position": "relative",
        "height": 105,
        "WebkitBoxSizing": "border-box",
        "MozBoxSizing": "border-box",
        "boxSizing": "border-box"
    },
    "right-sidebar divcollection a": {
        "lineHeight": 1,
        "paddingTop": 8,
        "paddingBottom": 8,
        "fontSize": 12
    },
    "right-sidebar divcollection a span": {
        "fontSize": 12
    },
    "margin-bottom-10": {
        "marginBottom": 10
    },
    "padding-bottom-10": {
        "paddingBottom": "10px !important"
    },
    "btn-new-css": {
        "fontSize": 0.7,
        "display": "inline",
        "width": "96%",
        "paddingTop": 0.5,
        "paddingRight": 0.5,
        "paddingBottom": 0.5,
        "paddingLeft": 0.5,
        "height": 27,
        "lineHeight": 11,
        "float": "left",
        "marginTop": 10
    },
    "work-order-tbl table tbody tr th": {
        "paddingTop": 5,
        "paddingRight": 5,
        "paddingBottom": 5,
        "paddingLeft": 5,
        "fontSize": 12,
        "verticalAlign": "top"
    },
    "work-order-tbl table tbody tr td": {
        "paddingTop": 5,
        "paddingRight": 5,
        "paddingBottom": 5,
        "paddingLeft": 5,
        "fontSize": 12,
        "verticalAlign": "top"
    },
    "inspection-tbl table thead tr th": {
        "paddingTop": 12,
        "paddingRight": 12,
        "paddingBottom": 12,
        "paddingLeft": 12,
        "fontSize": 12
    },
    "inspection-tbl table tbody tr th": {
        "paddingTop": 12,
        "paddingRight": 12,
        "paddingBottom": 12,
        "paddingLeft": 12,
        "fontSize": 12
    },
    "inspection-tbl table tbody tr td": {
        "paddingTop": 12,
        "paddingRight": 12,
        "paddingBottom": 12,
        "paddingLeft": 12,
        "fontSize": 12
    },
    "status-radio [type=\"radio\"]:not(:checked)+label": {
        "paddingLeft": 25,
        "paddingTop": 1,
        "fontSize": 0.8,
        "display": "inline"
    },
    "status-radio [type=\"radio\"]:checked+label": {
        "paddingLeft": 25,
        "paddingTop": 1,
        "fontSize": 0.8,
        "display": "inline"
    },
    "status-radio [type=\"radio\"]+label:before": {
        "width": 12,
        "height": 12
    },
    "status-radio [type=\"radio\"]+label:after": {
        "width": 12,
        "height": 12
    },
    "new-select-css": {
        "maxHeight": 30,
        "fontSize": 12
    },
    "msg-show": {
        "color": "#2196F3",
        "borderBottom": "1px dotted #2196F3"
    },
    "loading": {
        "marginLeft": "45%",
        "marginTop": "5%"
    }
});