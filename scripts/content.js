var extension_version = "Lite 0.2.0"

// 周末课表支持 Logic
if (document.querySelector("header > div.startClass > a")) {
    // 获取今天是周几
    var day = new Date().getDay()
    var syllabus_parameter = localStorage.getItem("inclass-syllabus-parameter")
    // response data sample: '{"dayCount":7,"classCount":9}'
    var syllabus_parameter_json = JSON.parse(syllabus_parameter)
    var dayCount = syllabus_parameter_json.dayCount
    if (dayCount == 5) {
        // 拼接 dayCount = 7 的 JSON
        var syllabus_parameter_json_7 = {
            "dayCount": 7,
            "classCount": syllabus_parameter_json.classCount
        }
        // 转换成字符串
        var syllabus_parameter_7 = JSON.stringify(syllabus_parameter_json_7)
        // 存入 localStorage
        localStorage.setItem("inclass-syllabus-parameter", syllabus_parameter_7)
    }

    setTimeout(function () {
        // 如果今天是周末
        if (day == 6 || day == 0) {
            if (day == 0) {
                day = 7
            }
            if (day == 6) {
                day = 6
            }
            // 在当周课表中找到对应列的 a 标签
            var syllabus = document.querySelectorAll("main > div.syllabus > div.week > div#syllabus > div.oneDay")
            var syllabusWeekToday = syllabus[day]
            var syllabusWeekToday_a = syllabusWeekToday.querySelectorAll("a")
            // 将除第一个和最后一个之外的的 a 都替换到首页 id="cellToday0" 到 id="cellToday8"，并添加 id="cellToday0" 至 id="cellToday(classCount - 1)" 属性
            for (var i = 1; i < syllabusWeekToday_a.length; i++) {
                var cellWeekToday = document.querySelector("main > div.syllabus > div#syllabusToday > a#cellToday" + (i - 1))
                var cellWeekToday_html = syllabusWeekToday_a[i].outerHTML
                cellWeekToday.outerHTML = cellWeekToday_html

            }

            var syllabusToday = document.querySelector("main > div.syllabus > div.today")
            var syllabusTodayHTML = syllabusToday.innerHTML
            var syllabusTodayHTMLNew = syllabusTodayHTML.replace(/0\|/g, day + "|")
            syllabusToday.innerHTML = syllabusTodayHTMLNew

            setInterval(function () {
                // 如果今天的 syllabus 没有 today 类
                if (!document.querySelector("main > div.syllabus > div.week > div#syllabus > div.oneDay:nth-child(" + (day + 2) + ")").classList.contains("today")) {
                    // 把错误安放在星期一标签上的 today 移除，并添加到对应标签上
                    var syllabusWrong = document.querySelector("main > div.syllabus > div.week > div#syllabus > div.today")
                    syllabusWrong.classList.remove("today")
                    var syllabusRight = document.querySelector("main > div.syllabus > div.week > div#syllabus > div.oneDay:nth-child(" + (day + 2) + ")")
                    syllabusRight.classList.add("today")
                }
                // 如果除今天的 syllabus 外还有别的 syllabus 有 today 类，则移除
                var syllabusWrong = document.querySelectorAll("main > div.syllabus > div.week > div#syllabus > div.oneDay")
                for (var i = 0; i < syllabusWrong.length; i++) {
                    if (syllabusWrong[i].classList.contains("today") && i != day) {
                        syllabusWrong[i].classList.remove("today")
                    }
                }
            }, 500)
        }
    }, 2000)

    // output version
    document.querySelector("main > p#icp").innerHTML = '<a href="https://github.com/LCZLab/HexFutureEnhancementLite" target="_blank">十六进制课堂增强扩展</a> 版本 ' + extension_version + ' | <a href="https://beian.miit.gov.cn" target="_blank">京ICP备16054026号-1</a>'


    /**
     * Modified from 今日诗词 V2 JS-SDK 1.2.2
     * 今日诗词 API 是一个可以免费调用的诗词接口：https://www.jinrishici.com
     * 替换名人名言 Logic
     */
    !function (e) {
        var n, t = {}, o = "jinrishici-token";
        function i() {
            return document.querySelector("main > div.saying > h1")
                || 0 != document.querySelector("main > div.saying > h1")
                    .length
        }
        function c() {
            t.load(function (e) {
                var n = document.querySelector("main > div.saying > h1")
                    , t = document.querySelector("main > div.saying > h1");
                if (n && (n.innerHTML = e.data.content + "<span>——" + e.data.origin.author + " 《" + e.data.origin.title + "》</span>"
                ),
                    0 !== t.length)
                    for (var o = 0; o < t.length; o++)
                        t[o].innerHTML = e.data.content + "<span>——" + e.data.origin.author + " 《" + e.data.origin.title + "》</span>"

            })
        }

        // 定时更换诗词
        // 每 10 分钟一次，可以自行修改原始码调节
        setInterval(function () {
            if (document.querySelector("header > div.finishClass > a")) {
                console.log("非主页，不执行更换诗词相关逻辑")
            } else {
                c()
                console.log("更换诗词事件触发")
            }
        }, 600000)

        function r(e, n) {
            var t = new XMLHttpRequest;
            t.open("get", n),
                t.withCredentials = !0,
                t.send(),
                t.onreadystatechange = function (n) {
                    if (4 === t.readyState) {
                        var o = JSON.parse(t.responseText);
                        "success" === o.status ? e(o) : console.error("今日诗词API加载失败，错误原因：" + o.errMessage)
                    }
                }
        }
        t.load = function (n) {
            return e.localStorage && e.localStorage.getItem(o) ? function (e, n) {
                return r(e, "https://v2.jinrishici.com/one.json?client=browser-sdk/1.2&X-User-Token=" + encodeURIComponent(n))
            }(n, e.localStorage.getItem(o)) : function (n) {
                return r(function (t) {
                    e.localStorage.setItem(o, t.token),
                        n(t)
                }, "https://v2.jinrishici.com/one.json?client=browser-sdk/1.2")
            }(n)
        }
            ,
            e.jinrishici = t,
            i() ? c() : (n = function () {
                i() && c()
            }
                ,
                "loading" != document.readyState ? n() : document.addEventListener ? document.addEventListener("DOMContentLoaded", n) : document.attachEvent("onreadystatechange", function () {
                    "complete" == document.readyState && n()
                }))
    }(window);
}
