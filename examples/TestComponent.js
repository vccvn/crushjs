import Dom from "../core/dom.js";
import { Article, Aside, B, Div, H3, I, Li, P, Span, U, Ul } from "../core/DomElements.js";
import createClass from "../core/es5.class.js";
import { useState } from "../core/State.js";

var TestComponent = createClass("TestComponent").extends(Dom)({

    constructor: function(data){
        this.state = useState("testData", data);
        // thật ra biến gì cũng dc
        // setup children o day cung dc
        // khong thi render
    },
    // trả ve children la mang hoac Dom hoac Element hoac string
    render: function(){
        return Div('#DoanDepTrai',[
            Div('Doãn Đẹp Trai'),
            Div("#children", [
                Span("Test hahahaz"),
                I('i haha'),
                B('Bold'),
                U('Under Line') 
            ]),
            P("Đây là thẻ p"),
            Ul('#the-ul', [
                Li('li 1'), Li('li 2'), Li('li 3'), Li('li 4'), Li('li 5'), Li('li 6'), Li('li 7'), Li('li 8'), Li('li 9')
            ]),
            Article('.article', [
                H3("", 'Article'),
                Aside("#aside",[
                    H3('#aside-title', "Aside"),
                    Div('.div', [
                        H3('.div-title', 'Title'),
                        Div('.div', [
                            H3('.div-title', 'Title'),
                            Div('.div', [
                                H3('.div-title', 'Title'),
                                Div('.div', [
                                    H3('.div-title', 'Title'),
                                    Div('.div', [
                                        H3('.div-title', 'Title'),
                                        Div('.div', [
                                            H3('.div-title', 'Title')
                                        ])
                                    ])
                                ])
                            ])
                        ])
                    ])
                ])
            ])

        ])
    }
});
export default TestComponent;