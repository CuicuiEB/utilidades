// ==UserScript==
// @name         ComboBot
// @namespace    http://tampermonkey.net/
// @version      1.1.14
// @description  Combina el BOT de cuervos y farmeo
// @author       Cuicui
// @match        https://marketplace.plantvsundead.com/*
// @icon         https://plantvsundead.com/assets/img/icon.svg
// @updateURL    https://raw.githubusercontent.com/CuicuiEB/helpbot/main/ComboBot.js
// @require      https://www.cssscript.com/demo/simple-vanilla-javascript-toast-notification-library-toastify/src/toastify.js
// @resource     REMOTE_CSS https://raw.githubusercontent.com/CuicuiEB/helpbot/main/toast.css
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    // Load remote JS
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://www.cssscript.com/demo/simple-vanilla-javascript-toast-notification-library-toastify/src/toastify.js",
        onload: (ev) => {
            let e = document.createElement('script');
            e.innerText = ev.responseText;
            document.head.appendChild(e);
        }
    });

    // Load remote CSS
    const remoteCss = GM_getResourceText("REMOTE_CSS");
    GM_addStyle(remoteCss);

    //Toast
    var dryWaterToast = Toastify({
        text: "Regar planta! ",
        close: true
    })

    var crowToast = Toastify({
        text: "Cuervo encontrado! ",
        close: true
    })

    var lastPageToast = Toastify({
        text: "No hay mas :( ",
        close: true
    })

    var maxWater = 25,
        checkloop = true,
        checkloopgagak = true,
        prevPage = 0,
        backgroundElement;

    console.log("Cargando...")

    var interval = setInterval(() => {
        var loadingGif = document.getElementsByClassName("loading-page");
        var capthaDialog = document.getElementsByClassName("v-dialog__content v-dialog__content--active");
        var bodyElement = document.getElementById("__layout").children[0].children[1].children[0];

        if (typeof (bodyElement) !== 'undefined') {
            if (bodyElement.className === "content-wrapper tw-bg-farm-mobile sm:tw-bg-farm-desktop tw-p-2") {
                if (loadingGif.length === 0) {
                    if (capthaDialog.length === 0) {
                        var curPage = document.getElementsByClassName("currentPage tw-mr-2")[0];
                        if (typeof (curPage) !== 'undefined')
                            curPage = curPage.innerText;

                        var maxPage = document.getElementsByClassName("text tw-mr-2")[1];
                        if (typeof (maxPage) !== 'undefined') {
                            maxPage = maxPage.innerText.match(/\d+/g);
                            maxPage = maxPage[0];
                        }

                        if (curPage != prevPage) {
                            var revertElement = document.getElementsByClassName("tw-p-3");
                            for (let i = 0; i < revertElement.length; i++) {
                                if (revertElement[i].style.backgroundColor == "red") {
                                    revertElement[i].style.backgroundColor = "#151721";
                                }
                                prevPage = prevPage++;
                            }
                        }

                        var validCount = 0,
                            kebonValidCount = 0,
                            gagakValidCount = 0;

                        var waterParent = document.getElementsByClassName("tw-absolute tool-icon");
                        for (let i = 0; i < waterParent.length; i++) {
                            if (waterParent[i].src === "https://marketplace.plantvsundead.com/_nuxt/img/water@3x.d5ca50d.png") {
                                console.log(waterParent[i].parentElement.children[2].innerText)
                                if (waterParent[i].parentElement.children[2].innerText < maxWater) {
                                    kebonValidCount++;
                                    validCount++;
                                    backgroundElement = waterParent[i].parentNode.parentNode.parentNode.parentNode.parentNode;
                                    waterParent[i].parentNode.parentNode.parentNode.parentNode.parentNode.style.backgroundColor = "red";
                                    if (checkloop) {
                                        waterParent[i].parentNode.parentNode.parentNode.parentNode.parentNode.scrollIntoView({
                                            block: 'end',
                                            behavior: 'smooth'
                                        });
                                        checkloop = false;
                                    }
                                }
                            }
                        }

                        let a = document.querySelectorAll('.crow-icon')
                        for (let index = 0; index < a.length; index++) {
                            let b = a[index];
                            if (b.getAttribute('style') == "") {
                                gagakValidCount++;
                                validCount++;
                                b.parentElement.parentElement.parentElement.style.backgroundColor = "red";
                                if (checkloopgagak) {
                                    b.parentElement.parentElement.parentElement.scrollIntoView({
                                        block: 'end',
                                        behavior: 'smooth'
                                    });
                                    checkloopgagak = false;
                                }
                            }
                        }

                        console.log("Current Page: " + (typeof (curPage) === 'undefined' ? 1 : curPage))
                        console.log("Total Page: " + (typeof (maxPage) === 'undefined' ? 1 : maxPage))
                        if (curPage == maxPage) {
                            if (kebonValidCount > 0) {
                                dryWaterToast.showToast();
                                console.log("Regar planta!");
                            }
                            if (gagakValidCount > 0) {
                                crowToast.showToast();
                                console.log("Cuervo a la vista!");
                            }
                            lastPageToast.showToast();
                            console.log("Es la ultima pagina :(");
                            clearInterval(interval);
                        } else if (validCount === 0) {
                            if (capthaDialog.length === 0) {
                                document.querySelectorAll('.tw-mt-6')[1].children[4].click();
                                prevPage = curPage;
                                checkloop = true;
                                checkloopgagak = true;

                            }
                        } else {
                            if (kebonValidCount > 0)
                                dryWaterToast.showToast();
                            if (gagakValidCount > 0)
                                crowToast.showToast();
                        }
                    }
                }
            }
        }
    }, 2000);
})();
