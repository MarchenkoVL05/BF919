function t835_init(recid) {
    var rec = document.querySelector("#rec" + recid);
    var quizWrapper = rec.querySelector(".t835__quiz-wrapper");
    var form = rec.querySelector(".t835 .t-form");
    var quizQuestion = rec.querySelectorAll(".t835 .t-input-group");
    var prevBtn = rec.querySelector(".t835__btn_prev");
    var nextBtn = rec.querySelector(".t835__btn_next");
    var resultBtn = rec.querySelector(".t835__btn_result");
    var errorBoxMiddle = rec.querySelector(".t-form__errorbox-middle .t-form__errorbox-wrapper");
    var captureFormHTML = '<div class="t835__capture-form"></div>';
    rec.querySelector(".t835 .t-form__errorbox-middle").insertAdjacentHTML("beforebegin", captureFormHTML);
    var quizQuestionNumber = 0;
    form.classList.remove("js-form-proccess");
    var specCommentInput = form.querySelector('input.js-form-spec-comments[name="form-spec-comments"]');
    if (form.getAttribute("formactiontype") != 1 && !specCommentInput) {
        form.insertAdjacentHTML(
            "beforebegin",
            '<div style="position: absolute; left: -5000px; bottom:0;"><input type="text" name="form-spec-comments" value="Its good" class="js-form-spec-comments"  tabindex="-1" /></div>'
        );
    }
    quizQuestion[quizQuestionNumber].style.display = "block";
    quizQuestion[quizQuestionNumber].classList.add("t-input-group-step_active");
    t835_workWithAnswerCode(rec);
    for (var i = 0; i < quizQuestion.length; i++) {
        quizQuestion[i].setAttribute("data-question-number", i);
    }
    t835_wrapCaptureForm(rec);
    t835_showCounter(rec, quizQuestionNumber);
    t835_disabledPrevBtn(rec, quizQuestionNumber);
    t835_checkLength(rec);
    nextBtn.addEventListener("click", function (event) {
        if (quizWrapper.classList.contains("t835__quiz-published")) {
            var showErrors = t835_setError(rec, quizQuestionNumber);
        }
        if (showErrors) {
            errorBoxMiddle.style.display = "none";
        }
        if (!showErrors) {
            quizQuestionNumber++;
            prevBtn.disabled = false;
            t835_setProgress(rec, 1);
            t835_showCounter(rec, quizQuestionNumber);
            t835_switchQuestion(rec, quizQuestionNumber);
            t835_scrollToTop(quizWrapper);
        }
        if (typeof document.querySelector(".t-records").getAttribute("data-tilda-mode") == "object") {
            if (window.lazy === "y" || document.querySelector("#allrecords").getAttribute("data-tilda-lazy") === "yes") {
                t_onFuncLoad("t_lazyload_update", function () {
                    t_lazyload_update();
                });
            }
        }
        event.preventDefault();
    });
    prevBtn.addEventListener("click", function (event) {
        if (quizQuestionNumber > 0) {
            quizQuestionNumber--;
        }
        t835_setProgress(rec, -1);
        if (typeof document.querySelector(".t-records").getAttribute("data-tilda-mode") == "object") {
            if (window.lazy === "y" || document.querySelector("#allrecords").getAttribute("data-tilda-lazy") === "yes") {
                t_onFuncLoad("t_lazyload_update", function () {
                    t_lazyload_update();
                });
            }
        }
        t835_awayFromResultScreen(rec);
        t835_showCounter(rec, quizQuestionNumber);
        t835_hideError(rec, quizQuestionNumber);
        t835_disabledPrevBtn(rec, quizQuestionNumber);
        t835_switchQuestion(rec, quizQuestionNumber);
        t835_scrollToTop(quizWrapper);
        event.preventDefault();
    });
    for (var i = 0; i < quizQuestion.length; i++) {
        quizQuestion[i].addEventListener("keypress", function (event) {
            var activeStep = form.querySelector(".t-input-group-step_active");
            if (
                event.keyCode === 13 &&
                !form.classList.contains("js-form-proccess") &&
                !activeStep.classList.contains("t-input-group_ta")
            ) {
                if (quizWrapper.classList.contains("t835__quiz-published")) {
                    var showErrors = t835_setError(rec, quizQuestionNumber);
                }
                var questionArr = t835_createQuestionArr(rec);
                if (showErrors) {
                    errorBoxMiddle.style.display = "none";
                }
                prevBtn.setAttribute("disabled", !1);
                if (!showErrors) {
                    quizQuestionNumber++;
                    t835_setProgress(rec, 1);
                    if (quizQuestionNumber < questionArr.length) {
                        t835_switchQuestion(rec, quizQuestionNumber);
                    } else {
                        t835_switchResultScreen(rec);
                        form.classList.add("js-form-proccess");
                    }
                    t835_scrollToTop(quizWrapper);
                    t835_disabledPrevBtn(rec, quizQuestionNumber);
                }
                if (typeof document.querySelector(".t-records").getAttribute("data-tilda-mode") == "object") {
                    if (window.lazy === "y" || document.querySelector("#allrecords").getAttribute("data-tilda-lazy") === "yes") {
                        t_onFuncLoad("t_lazyload_update", function () {
                            t_lazyload_update();
                        });
                    }
                }
                event.preventDefault();
            }
        });
    }
    resultBtn.addEventListener("click", function (event) {
        if (quizWrapper.classList.contains("t835__quiz-published")) {
            var showErrors = t835_setError(rec, quizQuestionNumber);
        }
        if (showErrors) {
            errorBoxMiddle.style.display = "none";
        }
        if (!showErrors) {
            quizQuestionNumber++;
            t835_setProgress(rec, 1);
            t835_switchResultScreen(rec);
            t835_scrollToTop(quizWrapper);
            form.classList.add("js-form-proccess");
            t835_disabledPrevBtn(rec, quizQuestionNumber);
        }
        event.preventDefault();
    });
}

function t835_workWithAnswerCode(rec) {
    var groupRi = rec.querySelector(".t-input-group_ri").querySelectorAll("input");
    for (var i = 0; i < groupRi.length; i++) {
        if (groupRi[i]) {
            t835_setAnswerCode(groupRi[i]);
            var label = groupRi[i].parentNode.querySelector(".t-img-select__text");
            label.textContent = label.textContent.split("value::")[0].trim();
        }
    }
    var groupRd = rec.querySelector(".t-input-group_rd").querySelectorAll("input");
    for (var i = 0; i < groupRd.length; i++) {
        if (groupRd[i]) {
            t835_setAnswerCode(groupRd[i]);
            var label = groupRd[i];
            var html = groupRd[i].innerHTML.split("value::")[0].trim();
            label.innerHTML = html;
        }
    }
}

function t835_setAnswerCode(group) {
    var parameter = group.value.trim();
    group.value = parameter;
}

function t835_scrollToTop(quizFormWrapper) {
    var rect = quizFormWrapper.getBoundingClientRect().top + document.body.scrollTop;
    var topCoordinateForm = rect;
    var paddingTop = 0;
    var blockContainer = quizFormWrapper.closest(".t835");
    if (topCoordinateForm >= window.scrollY || blockContainer.classList.contains("t835_scroll-disabled")) return;
    //   if (document.querySelector('.t228__positionfixed').length > 0 && !window.isMobile) {
    //           paddingTop = paddingTop + document.querySelector('.t228__positionfixed').clientHeight
    //   }
    document.querySelector("body").transition = "all" + 0;
    var scroll = topCoordinateForm - paddingTop;
    document.querySelector("body").style.scrollTop = scroll;
}

function t835_checkLength(rec) {
    var nextBtn = rec.querySelector(".t835__btn_next");
    var resultBtn = rec.querySelector(".t835__btn_result");
    var questionArr = t835_createQuestionArr(rec);
    if (questionArr.length < 2) {
        nextBtn.style.display = "none";
        resultBtn.style.display = "block";
    }
}

function t835_showCounter(rec, quizQuestionNumber) {
    var counter = rec.querySelector(".t835__quiz-description-counter");
    var questionArr = t835_createQuestionArr(rec);
    counter.innerHTML = quizQuestionNumber + 1 + "/" + questionArr.length;
}

function t835_setError(rec, quizQuestionNumber) {
    var questionArr = t835_createQuestionArr(rec);
    var currentQuestion = questionArr[quizQuestionNumber];
    var showErrors;
    if (typeof window.tildaForm !== "object") return showErrors;
    var arErrors = window.tildaForm.validate(currentQuestion);
    currentQuestion.classList.add("js-error-control-box");
    var errorsTypeObj = arErrors[0];
    if (errorsTypeObj != undefined) {
        var errorType = errorsTypeObj.type[0];
        if (errorType === "emptyfill") {
            errorType = "req";
        }
        var errorTextCustom = rec
            .querySelector(".t835 .t-form")
            .querySelector(".t-form__errorbox-middle")
            .querySelector(".js-rule-error-" + errorType).textContent;
        var sError = "";
        if (errorTextCustom != "") {
            sError = errorTextCustom;
        } else {
            t_onFuncLoad("t_form_dict", function () {
                sError = t_form_dict(errorType);
            });
        }
        showErrors = errorType == "emptyfill" ? !1 : window.tildaForm.showErrors(currentQuestion, arErrors);
        currentQuestion.querySelector(".t-input-error").innerHTML = sError;
    }
    return showErrors;
}

function t835_hideError(rec, quizQuestionNumber) {
    var questionArr = t835_createQuestionArr(rec);
    var currentQuestion = questionArr[quizQuestionNumber];
    currentQuestion.classList.remove("js-error-control-box");
    currentQuestion.querySelector(".t-input-error").innerHTML;
}

function t835_setProgress(rec, index) {
    var progressbar = rec.querySelector(".t835__progressbar");
    var progressbarWidth = parseFloat(getComputedStyle(progressbar, null).width.replace("px", ""));
    var progress = rec.querySelector(".t835__progress");
    var questionArr = t835_createQuestionArr(rec);
    var progressWidth = parseFloat(getComputedStyle(progress, null).width.replace("px", ""));
    var progressStep = progressbarWidth / questionArr.length;
    var percentProgressWidth = ((progressWidth + index * progressStep) / progressbarWidth) * 100 + "%";
    progress.style.width = percentProgressWidth;
}

function t835_wrapCaptureForm(rec) {
    var captureForm = rec.querySelector(".t835__capture-form");
    var quizQuestion = rec.querySelectorAll(".t835 .t-input-group");
    var quizFormWrapper = rec.querySelector(".t835__quiz-form-wrapper");
    for (var i = 0; i < quizQuestion.length; i++) {
        var currentQuizQuestion = quizQuestion[i];
        var emailInputExist = currentQuizQuestion.classList.contains("t-input-group_em");
        var nameInputExist = currentQuizQuestion.classList.contains("t-input-group_nm");
        var phoneInputExist = currentQuizQuestion.classList.contains("t-input-group_ph");
        var checkboxInputExist = currentQuizQuestion.classList.contains("t-input-group_cb");
        var quizQuestionNumber = currentQuizQuestion.getAttribute("data-question-number");
        var maxCountOfCaptureFields = quizFormWrapper.classList.contains("t835__quiz-form-wrapper_withcheckbox") ? 4 : 3;
        if (quizQuestionNumber >= quizQuestion.length - maxCountOfCaptureFields) {
            var isCaptureGroup = !0;
            if (quizFormWrapper.classList.contains("t835__quiz-form-wrapper_newcapturecondition")) {
                isCaptureGroup =
                    quizQuestion[i].classList.contains("t-input-group_cb") ||
                    quizQuestion[i].classList.contains("t-input-group_em") ||
                    quizQuestion[i].classList.contains("t-input-group_nm") ||
                    quizQuestion[i].classList.contains("t-input-group_ph");
            }
            if (isCaptureGroup) {
                if (quizFormWrapper.classList.contains("t835__quiz-form-wrapper_withcheckbox")) {
                    if (emailInputExist || nameInputExist || phoneInputExist || checkboxInputExist) {
                        currentQuizQuestion.classList.add("t835__t-input-group_capture");
                        captureForm.appendChild(currentQuizQuestion);
                    }
                } else {
                    if (emailInputExist || nameInputExist || phoneInputExist) {
                        currentQuizQuestion.classList.add("t835__t-input-group_capture");
                        captureForm.appendChild(currentQuizQuestion);
                    }
                }
            }
        }
    }
}

function t835_createQuestionArr(rec) {
    var quizQuestion = rec.querySelectorAll(".t835 .t-input-group");
    var questionArr = [];
    for (var i = 0; i < quizQuestion.length; i++) {
        if (!quizQuestion[i].classList.contains("t835__t-input-group_capture")) {
            questionArr.push(quizQuestion[i]);
        }
    }
    return questionArr;
}

function t835_disabledPrevBtn(rec, quizQuestionNumber) {
    var prevBtn = rec.querySelector(".t835__btn_prev");
    quizQuestionNumber == 0 ? (prevBtn.disabled = true) : (prevBtn.disabled = false);
}

function t835_switchQuestion(rec, quizQuestionNumber) {
    var nextBtn = rec.querySelector(".t835__btn_next");
    var resultBtn = rec.querySelector(".t835__btn_result");
    var questionArr = t835_createQuestionArr(rec);
    for (var i = 0; i < questionArr.length; i++) {
        questionArr[i].style.display = "none";
        questionArr[i].classList.remove("t-input-group-step_active");
        questionArr[quizQuestionNumber].style.display = "block";
        questionArr[quizQuestionNumber].classList.add("t-input-group-step_active");
    }
    if (quizQuestionNumber === questionArr.length - 1) {
        nextBtn.style.display = "none";
        resultBtn.style.display = "block";
    } else {
        nextBtn.style.display = "block";
        resultBtn.style.display = "none";
    }
}

function t835_switchResultScreen(rec) {
    var captureForm = rec.querySelector(".t835__capture-form");
    var quizDescription = rec.querySelector(".t835__quiz-description");
    var resultTitle = rec.querySelector(".t835__result-title");
    var resultBtn = rec.querySelector(".t835__btn_result");
    var submitBtnWrapper = rec.querySelector(".t835 .t-form__submit");
    var questionArr = t835_createQuestionArr(rec);
    for (var i = 0; i < questionArr.length; i++) {
        questionArr[i].style.display = "none";
    }
    captureForm.style.display = "block";
    resultBtn.style.display = "none";
    quizDescription.style.display = "none";
    resultTitle.style.display = "block";
    submitBtnWrapper.style.display = "block";
}

function t835_awayFromResultScreen(rec) {
    var captureForm = rec.querySelector(".t835__capture-form");
    var quizDescription = rec.querySelector(".t835__quiz-description");
    var resultTitle = rec.querySelector(".t835__result-title");
    var submitBtnWrapper = rec.querySelector(".t835 .t-form__submit");
    submitBtnWrapper.style.display = "none";
    captureForm.style.display = "none";
    quizDescription.style.display = "block";
    resultTitle.style.display = "none";
}

function t835_onSuccess(form) {
    var inputsWrapper = form.querySelector(".t-form__inputsbox");
    var inputsHeight = inputsWrapper.clientHeight;
    var rect = inputsWrapper.getBoundingClientRect().top + window.pageYOffset;
    var inputsOffset = rect;
    var inputsBottom = inputsHeight + inputsOffset;
    var targetOffset = form.querySelector(".t-form__successbox").getBoundingClientRect().top + window.pageYOffset;
    var prevBtn = form.closest(".t835").querySelector(".t835__btn_prev");
    var target;
    if (window.document.documentElement.clientHeight > 960) {
        target = targetOffset - 200;
    } else {
        target = targetOffset - 100;
    }
    var body = document.body;
    var html = document.documentElement;
    var documentHeight = Math.max(body.offsetHeight, body.scrollHeight, html.clientHeight, html.offsetHeight, html.scrollHeight);
    if (targetOffset > document.body.scrollTop || documentHeight - inputsBottom < window.innerHeight - 100) {
        inputsWrapper.classList.add("t835__inputsbox_hidden");
        setTimeout(function () {
            if (window.innerHeight > document.querySelector(".t-body").clientHeight) {
                document.querySelector(".t-tildalabel").style.transition = "all " + 50 + "ms";
                document.querySelector(".t-tildalabel").style.opacity = "0";
            }
        }, 300);
    } else {
        document.querySelector("body").style.transition = "all " + 400 + "ms";
        document.querySelector("body").style.scrollTop = target;

        setTimeout(function () {
            inputsWrapper.classList.add("t835__inputsbox_hidden");
        }, 400);
    }
    var successurl = form.getAttribute("success-url");
    if (successurl && successurl.length > 0) {
        setTimeout(function () {
            window.location.href = successurl;
        }, 500);
    }
    prevBtn.style.display = "none";
}
