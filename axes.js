export default class Axes {
  #canvasProps;
  #ctx;

  #tickMarks;

  #gridX = [];
  #gridY = [];

  constructor(
    containerId,
    {
      width = 900,
      height = 900,
      padding = 10,
      lineWidth = 2,
      enableGuideLines = false,
      dotSize = 10,
      axisColor = "gray",
      backgroundColor = "lightgray",
    } = {}
  ) {
    const container = document.getElementById(containerId);
    if (!container)
      throw new Error(`Container with ID '${containerId}' not found`);

    if (width < 0 || height < 0 || padding < 0 || lineWidth < 0 || dotSize < 0)
      throw new Error("Props must be greater than zero");

    const canvas = document.createElement("canvas");
    canvas.id = "axis";

    canvas.width = width;
    canvas.height = height;

    this.#canvasProps = {
      width,
      height,
      padding,
      lineWidth,
      enableGuideLines,
      axisColor,
      dotSize,
    };

    canvas.style.backgroundColor = backgroundColor;

    container.appendChild(canvas);

    this.#ctx = canvas.getContext("2d");

    this.#drawAxes();
  }

  // Get half the width and height of the canvas
  #getCanvasHalfDimensions() {
    return {
      width: this.#canvasProps.width / 2,
      height: this.#canvasProps.height / 2,
    };
  }

  #drawAxes() {
    this.#ctx.beginPath();

    this.#ctx.strokeStyle = this.#canvasProps.axisColor;

    const halfCanvasDimensions = this.#getCanvasHalfDimensions();

    this.#ctx.lineWidth = this.#canvasProps.lineWidth;
    // Y-axis
    this.#ctx.moveTo(halfCanvasDimensions.width, this.#canvasProps.padding);
    this.#ctx.lineTo(
      halfCanvasDimensions.width,
      this.#canvasProps.height - this.#canvasProps.padding
    );
    this.#ctx.stroke();

    // X-axis
    this.#ctx.moveTo(this.#canvasProps.padding, halfCanvasDimensions.height);
    this.#ctx.lineTo(
      this.#canvasProps.width - this.#canvasProps.padding,
      halfCanvasDimensions.height
    );
    this.#ctx.stroke();

    // this.#drawDot();

    this.#ctx.closePath();
  }

  #drawAxisArrows() {
    const halfCanvasDimensions = this.#getCanvasHalfDimensions();

    this.#ctx.beginPath();

    this.#ctx.font = "bold 15pt Courier";

    // Y-axis arrow
    //    Left
    this.#ctx.moveTo(
      halfCanvasDimensions.width,
      this.#canvasProps.lineWidth + this.#canvasProps.padding
    );
    this.#ctx.lineTo(
      halfCanvasDimensions.width - this.#canvasProps.dotSize,
      this.#canvasProps.dotSize + this.#canvasProps.padding
    );

    //    Right
    this.#ctx.moveTo(
      halfCanvasDimensions.width,
      this.#canvasProps.lineWidth + this.#canvasProps.padding
    );
    this.#ctx.lineTo(
      halfCanvasDimensions.width + this.#canvasProps.dotSize,
      this.#canvasProps.dotSize + this.#canvasProps.padding
    );

    //    Letter
    this.#ctx.fillText(
      "y",
      halfCanvasDimensions.width + this.#canvasProps.dotSize,
      this.#canvasProps.dotSize + this.#canvasProps.padding
    );

    // X-axis arrow
    //    Left
    this.#ctx.moveTo(
      this.#canvasProps.width - this.#canvasProps.padding,
      halfCanvasDimensions.height
    );
    this.#ctx.lineTo(
      this.#canvasProps.width -
        this.#canvasProps.dotSize -
        this.#canvasProps.padding,
      halfCanvasDimensions.height - this.#canvasProps.dotSize
    );

    //    Right
    this.#ctx.moveTo(
      this.#canvasProps.width - this.#canvasProps.padding,
      halfCanvasDimensions.height
    );
    this.#ctx.lineTo(
      this.#canvasProps.width -
        this.#canvasProps.dotSize -
        this.#canvasProps.padding,
      halfCanvasDimensions.height + this.#canvasProps.dotSize
    );

    //    Letter
    this.#ctx.fillText(
      "x",
      this.#canvasProps.width -
        this.#canvasProps.dotSize -
        this.#canvasProps.padding,
      halfCanvasDimensions.height - this.#canvasProps.dotSize
    );

    this.#ctx.stroke();
    this.#ctx.closePath();
  }

  setTickMarks(tickMarks) {
    if (typeof tickMarks !== "number" || tickMarks < 0 || isNaN(tickMarks)) {
      throw new Error("Tick marks must be a positive number or zero");
    }

    this.#tickMarks = tickMarks;

    this.#drawTickMarks();
  }

  #drawTickMarks() {
    this.#ctx.beginPath();

    this.#ctx.fillStyle = this.#canvasProps.axisColor;

    const halfDotSize = this.#canvasProps.dotSize / 2;

    const halfCanvasDimensions = this.#getCanvasHalfDimensions();

    // Calculate the pixel size of half an axis considering canvas dimensions and padding
    const halfAxisWidth =
      this.#canvasProps.width -
      halfCanvasDimensions.width -
      this.#canvasProps.padding;
    const halfAxisHeight =
      this.#canvasProps.height -
      halfCanvasDimensions.height -
      this.#canvasProps.padding;

    // Calculates the uniform distance between tick marks on each half of the axis,
    // based on the total number of tick marks specified
    const tickSpacingX = halfAxisWidth / this.#tickMarks;
    const tickSpacingY = halfAxisHeight / this.#tickMarks;

    // Calculate the centered position of the tick mark on each axis, adjusted for dot size
    const tickMarkCenterX = halfCanvasDimensions.width - halfDotSize;
    const tickMarkCenterY = halfCanvasDimensions.height - halfDotSize;

    // Calculate corrections to ensure the central tick mark is perfectly centered
    const halfLineWidthRounded = Math.round(this.#canvasProps.lineWidth / 2);
    const dotSizeLineWidthOffset =
      (this.#canvasProps.dotSize - this.#canvasProps.lineWidth) / 2;

    const fontSize = 16;
    this.#ctx.font = `${fontSize}px Courier`;
    this.#ctx.textBaseline = "middle";

    // X
    let point = halfCanvasDimensions.width - halfLineWidthRounded;
    this.#gridX[0] = point - dotSizeLineWidthOffset;

    for (let i = 1; i <= this.#tickMarks; i++) {
      // Calculate the X position for the tick in the positive direction (to the right)
      const positiveX = point + tickSpacingX * i; // e.g. If tickSpacingX = 10 and i = 1, the position will be 10; with i = 2, it will be 20, etc.

      // Assign the pixel position of the tick mark in the positive direction to the gridX array
      this.#gridX[i] = positiveX - dotSizeLineWidthOffset;

      this.drawTickMark(positiveX, tickMarkCenterY);

      this.writeNumber(
        i,
        positiveX,
        tickMarkCenterY + dotSizeLineWidthOffset,
        fontSize
      );

      // Calculate the X position for the tick in the negative direction (to the left)
      const negativeX = point - tickSpacingX * i; // e.g. If tickSpacingX = 10 and i = 1, the position will be -10; with i = 2, it will be -20, etc.

      // Assign the pixel position of the tick mark in the negative direction to the gridX array
      this.#gridX[-i] = negativeX - dotSizeLineWidthOffset;

      this.drawTickMark(negativeX, tickMarkCenterY);

      this.writeNumber(
        -i,
        negativeX,
        tickMarkCenterY + dotSizeLineWidthOffset,
        fontSize
      );
    }

    // Y
    point = halfCanvasDimensions.height - halfLineWidthRounded;
    this.#gridY[0] = point - dotSizeLineWidthOffset;

    for (let i = 1; i <= this.#tickMarks; i++) {
      const positiveY = point - tickSpacingY * i;
      this.#gridY[i] = positiveY - dotSizeLineWidthOffset;

      this.drawTickMark(tickMarkCenterX, positiveY, false);

      this.writeNumber(
        i,
        tickMarkCenterX - dotSizeLineWidthOffset,
        positiveY,
        fontSize,
        false
      );

      const negativeY = point + tickSpacingY * i;
      this.#gridY[-i] = negativeY - dotSizeLineWidthOffset;

      this.drawTickMark(tickMarkCenterX, negativeY, false);

      this.writeNumber(
        -i,
        tickMarkCenterX - dotSizeLineWidthOffset,
        negativeY,
        fontSize,
        false
      );
    }

    this.#ctx.fill();
    this.#ctx.closePath();

    this.#drawAxisArrows();
  }

  drawTickMark(x, y, horizontal = true) {
    const tickMarkDimensions = this.getTickMarkDimensions(horizontal);

    this.#ctx.rect(x, y, tickMarkDimensions.width, tickMarkDimensions.height);
  }

  writeNumber(i, referenceX, referenceY, fontSize, horizontal = true) {
    const tickMarkDimensions = this.getTickMarkDimensions(horizontal);

    const textMetrics = this.#ctx.measureText(i);
    // referenceX + (referenceWidth - textMetrics.width) / 2
    const textX =
      referenceX + (tickMarkDimensions.width - textMetrics.width) / 2;

    // referenceY + referenceHeight / 2
    const textY = referenceY + tickMarkDimensions.height / 2;

    this.#ctx.fillText(
      i,
      textX - (horizontal ? 0 : fontSize),
      textY + (horizontal ? fontSize : 0)
    );
  }

  getTickMarkDimensions(horizontal) {
    // Use an array to map the values based on orientation
    const dimensions = [this.#canvasProps.lineWidth, this.#canvasProps.dotSize];

    return {
      width: dimensions[+!horizontal], // '0' if horizontal, '1' if not
      height: dimensions[+horizontal], // '1' if horizontal, '0' if not
    };
  }

  #drawDot() {
    const halfCanvasMinusDotSize =
      (this.#canvasProps.width - this.#canvasProps.dotSize) / 2;

    this.#ctx.rect(
      halfCanvasMinusDotSize,
      halfCanvasMinusDotSize,
      this.#canvasProps.dotSize,
      this.#canvasProps.dotSize
    );
    this.#ctx.fill();
  }

  // Helper method to calculate the pixel position for the given coordinate (x or y)
  #getCoord(coord, truncatedCoord, grid) {
    if (coord === truncatedCoord) return grid[coord];

    // For example, if coord = 2.71 and truncatedCoord = 2, the decimalDiff will be 0.71.
    const decimalDiff = coord - truncatedCoord;

    // For example, if truncatedCoord = 2, currentCoordPixel = grid[2], which could be 10.
    const currentCoordPixel = grid[truncatedCoord];
    const nextCoordPixel = grid[truncatedCoord + 1];

    // For example, if grid[3] = 20 and grid[2] = 10, diffPixel = 10.
    const diffPixel = nextCoordPixel - currentCoordPixel;

    // For example, if decimalDiff = 0.71 and diffPixel = 10, the pixel position will be:
    // 10 + (10 * 0.71) = 10 + 7.1 = 17.1.
    // This means that the pixel position for the coordinate 2.71 is 17.1.
    return currentCoordPixel + diffPixel * decimalDiff;
  }

  draw(x, y, color) {
    const truncatedX = Math.trunc(x);
    const truncatedY = Math.trunc(y);

    // Check if the coordinates exceed the allowed tick marks range
    if (this.checkIfCoordIsValid(x, y, truncatedX, truncatedY)) {
      console.log("(" + x + ", " + y + ") no es una coordenada válida");
    } else {
      // Get the pixel coordinates for the given x and y
      const finalX = this.#getCoord(x, truncatedX, this.#gridX);
      const finalY = this.#getCoord(y, truncatedY, this.#gridY);

      if (this.#canvasProps.enableGuideLines) {
        // Guide lines are drawn first to ensure they appear behind the points/dots
        this.drawGuideLine(finalX, finalY, color);
      }

      this.#ctx.beginPath();

      this.#ctx.fillStyle = color ?? "black";

      this.#ctx.rect(
        finalX,
        finalY,
        this.#canvasProps.dotSize,
        this.#canvasProps.dotSize
      );
      this.#ctx.fill();

      this.#ctx.closePath();
    }
  }

  drawGuideLine(x, y, color) {
    this.#ctx.beginPath();

    const halfCanvasDimensions = this.#getCanvasHalfDimensions();
    const halfDotSize = this.#canvasProps.dotSize / 2;

    this.#ctx.setLineDash([1, 1]);

    this.#ctx.strokeStyle = color ?? "black";

    // Each guide line extends from the axis to the center of the point/dot

    // X
    if (halfCanvasDimensions.width !== y + halfDotSize) {
      // A guide line for the X-axis is drawn only if the point is not located at y = 0
      this.#ctx.moveTo(halfCanvasDimensions.width, y + halfDotSize);
      this.#ctx.lineTo(x + halfDotSize, y + halfDotSize);
    }

    // Y
    if (halfCanvasDimensions.height !== x + halfDotSize) {
      // A guide line for the Y-axis is drawn only if the point is not located at x = 0
      this.#ctx.moveTo(x + halfDotSize, halfCanvasDimensions.height);
      this.#ctx.lineTo(x + halfDotSize, y + halfDotSize);
    }

    this.#ctx.stroke();

    this.#ctx.closePath();
  }

  checkIfCoordIsValid(x, y, truncatedX, truncatedY) {
    return (
      Math.abs(x) > this.#tickMarks ||
      Math.abs(truncatedX) > this.#tickMarks ||
      Math.abs(y) > this.#tickMarks ||
      Math.abs(truncatedY) > this.#tickMarks
    );
  }
}
