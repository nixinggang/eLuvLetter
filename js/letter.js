String.prototype.pxWidth = function (font) {
	let canvas = String.prototype.pxWidth.canvas ||
		(String.prototype.pxWidth.canvas = document.createElement("canvas")),
		context = canvas.getContext("2d");

	font && (context.font = font);
	let metrics = context.measureText(this);

	return metrics.width;
}

function isNumber(str) {
	return !isNaN(parseInt(str));
}

function getPureStr(str) {
	let spices = str.split('^');
	let res = spices[0];
	for (let i = 1; i < spices.length; i++) {
		let tmp = spices[i];
		if (isNumber(tmp.charAt(0))) {
			let rm = parseInt(tmp).toString();
			tmp = tmp.substring(rm.length);
		}
		else {
			tmp = '^' + tmp;
		}
		res += tmp;
	}
	return res;
}

function loadingPage() {
	let heart_div = $('.heart');
	let heart_parent = heart_div.parent();
	let page_width = heart_parent.width();
	let page_height = heart_parent.height();
	let heart_width = heart_div.width();
	let heart_height = heart_div.height();
	heart_div.css('top', (page_height - heart_height) / 2);
	heart_div.css('left', (page_width - heart_width) / 2);
}
// ===== Password Gate Config =====
var CORRECT_PWD = "0226";
var pwdVerified = false;

// 弹窗相关
function openPwdModal() {
	$("#pwdHint").text("");
	$("#pwdInputs .pwd-box").val("");
	$("#pwdModal").addClass("show").attr("aria-hidden", "false");
	setTimeout(function () {
		$("#pwdInputs .pwd-box").eq(0).focus();
	}, 50);
}

function closePwdModal() {
	$("#pwdModal").removeClass("show").attr("aria-hidden", "true");
}

function getPwdCode() {
	var code = "";
	$("#pwdInputs .pwd-box").each(function () {
		code += ($(this).val() || "");
	});
	return code;
}

function verifyPwdThenOpen() {
	var code = getPwdCode();
	if (code.length < 4) {
		$("#pwdHint").text("请输入4位数字");
		return;
	}
	if (code === CORRECT_PWD) {
		pwdVerified = true;
		closePwdModal();
		// 触发打开（这次会放行）
		$("#open").trigger("click");
	} else {
		$("#pwdHint").text("密码错误");
		$("#pwdInputs .pwd-box").val("");
		$("#pwdInputs .pwd-box").eq(0).focus();
	}
}

// 输入框体验：只允许数字、自动跳格、满4位自动验证
$(function () {
	$("#pwdInputs .pwd-box").on("input", function () {
		this.value = this.value.replace(/\D/g, "");
		var $boxes = $("#pwdInputs .pwd-box");
		var idx = $boxes.index(this);
		if (this.value && idx < $boxes.length - 1) {
			$boxes.eq(idx + 1).focus();
		}
		if (getPwdCode().length === 4) verifyPwdThenOpen();
	});

	$("#pwdInputs .pwd-box").on("keydown", function (e) {
		var $boxes = $("#pwdInputs .pwd-box");
		var idx = $boxes.index(this);
		if (e.key === "Backspace" && !this.value && idx > 0) {
			$boxes.eq(idx - 1).focus();
		}
		if (e.key === "Enter") verifyPwdThenOpen();
	});

	$("#pwdOk").on("click", verifyPwdThenOpen);
	$("#pwdCancel").on("click", closePwdModal);

	// 点击遮罩关闭
	$("#pwdModal").on("click", function (e) {
		if (e.target === this) closePwdModal();
	});
});

// ===== Your Original Open Logic (wrapped with password) =====
$("#open").click(function (e) {

	// 先做密码门禁：没验证就拦截，不让执行原本打开逻辑
	if (!pwdVerified) {
		e.preventDefault();
		openPwdModal();
		return false;
	}

	// 放行一次后立刻重置（下次还要输入）
	pwdVerified = false;

	// ====== 以下保持你原来的逻辑不变 ======
	if (!envelope_opened) {

		$('#wax-half').css('display', "block");

		new Typed('.letter', {
			strings: [
				"^1000",
				content.recipient + "<br><br>" +
				content.text + "<br><br><p style='float:right; display:block; width:" +
				content.sign + "px;'>^1000" + content.from + "</p>"
			],
			typeSpeed: 100,
			backSpeed: 50
		});

		$('#open').find("span").eq(0).css('background-position', "0 -150px");

		envelope_opened = true;

		let player = document.getElementById('music');
		if (player.paused) {
			player.play();
			$('#music_btn').css("display", "block");
		}
	}
});
