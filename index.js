"use strict";

import { drawText } from "https://cdn.jsdelivr.net/npm/canvas-txt@4.1.1/+esm";
import { printCanvas } from "./src/printer.js";

const $ = document.querySelector.bind(document);
const $all = document.querySelectorAll.bind(document);

const labelSize = { width: 40, height: 12 };

const updateLabelSize = (canvas) => {
	const inputWidth = $("#inputWidth").valueAsNumber;
	const inputHeight = $("#inputHeight").valueAsNumber;
	if (isNaN(inputWidth) || isNaN(inputHeight)) {
		handleError("label size invalid");
		return;
	}

	labelSize.width = inputWidth;
	labelSize.height = inputHeight;

	// Image sent to printer is printed top to bottom, so reverse width and height
	canvas.width = labelSize.height * 8;
	canvas.height = labelSize.width * 8;
};

const updateCanvasText = (canvas) => {
	const text = $("#inputText").value;
	const fontSize = $("#inputFontSize").valueAsNumber;
	const repeatCount = $("#inputRepeatCount").valueAsNumber || 1;
	const isVertical = $("#btnOrientation").dataset.orientation === "vertical";
	const rotation = isVertical ? Math.PI / 2 : 0;

	if (isNaN(fontSize)) {
		handleError("font size invalid");
		return;
	}
	if (isNaN(repeatCount) || repeatCount < 1) {
		handleError("repeat count must be a positive number");
		return;
	}

	const ctx = canvas.getContext("2d");
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Save the current context state
	ctx.save();

	// Move to center, rotate, then move back
	ctx.translate(canvas.width / 2, canvas.height / 2);
	ctx.rotate(rotation);

	ctx.fillStyle = "#000";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	// Add newline if repeating and doesn't end with one
	let processedText = text;
	if (repeatCount > 1 && !text.endsWith("\n")) {
		processedText = text + "\n";
	}

	// Repeat text and remove trailing newline from final result
	const repeatedText = processedText.repeat(repeatCount).replace(/\n$/, "");

	// Calculate dimensions based on orientation
	const textWidth = isVertical ? canvas.height : canvas.width;
	const textHeight = isVertical ? canvas.width : canvas.height;

	drawText(ctx, repeatedText, {
		x: -textWidth / 2,
		y: -textHeight / 2,
		width: textWidth,
		height: textHeight,
		font: "sans-serif",
		fontSize,
		align: "center",
		vAlign: "middle",
	});

	// Restore the context to its original state
	ctx.restore();
};

const updateCanvasBarcode = (canvas) => {
	const barcodeData = $("#inputBarcode").value;
	const image = document.createElement("img");
	image.addEventListener("load", () => {
		const ctx = canvas.getContext("2d");
		ctx.fillStyle = "#fff";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.translate(canvas.width / 2, canvas.height / 2);
		ctx.rotate(Math.PI / 2);

		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(image, -image.width / 2, -image.height / 2);

		ctx.rotate(-Math.PI / 2);
		ctx.translate(-canvas.width / 2, -canvas.height / 2);
	});

	JsBarcode(image, barcodeData, {
		format: "CODE128",
		width: 2,
		height: labelSize.height * 7,
		displayValue: false,
	});
};

const handleError = (err) => {
	console.error(err);

	const toast = bootstrap.Toast.getOrCreateInstance($("#errorToast"));
	$("#errorText").textContent = err.toString();
	toast.show();
};

document.addEventListener("DOMContentLoaded", function () {
	const canvas = document.querySelector("#canvas");

	document.addEventListener("shown.bs.tab", (e) => {
		if (e.target.id === "nav-text-tab") updateCanvasText(canvas);
		else if (e.target.id === "nav-barcode-tab") updateCanvasBarcode(canvas);
	});

	$all("#inputWidth, #inputHeight").forEach((e) =>
		e.addEventListener("input", () => updateLabelSize(canvas))
	);
	updateLabelSize(canvas);

	$all("#inputText, #inputFontSize, #inputRepeatCount").forEach((e) =>
		e.addEventListener("input", () => updateCanvasText(canvas))
	);
	updateCanvasText(canvas);

	$("#inputBarcode").addEventListener("input", () => updateCanvasBarcode(canvas));

	$("form").addEventListener("submit", (e) => {
		e.preventDefault();
		navigator.bluetooth
			.requestDevice({
				acceptAllDevices: true,
				optionalServices: ["0000ff00-0000-1000-8000-00805f9b34fb"],
			})
			.then((device) => device.gatt.connect())
			.then((server) => server.getPrimaryService("0000ff00-0000-1000-8000-00805f9b34fb"))
			.then((service) => service.getCharacteristic("0000ff02-0000-1000-8000-00805f9b34fb"))
			.then((char) => printCanvas(char, canvas))
			.catch(handleError);
	});

	$("#btnOrientation").addEventListener("click", (e) => {
		const btn = e.currentTarget;
		const isVertical = btn.dataset.orientation === "horizontal";
		btn.dataset.orientation = isVertical ? "vertical" : "horizontal";
		btn.textContent = isVertical ? "Vertical" : "Horizontal";
		updateCanvasText(canvas);
	});
});
