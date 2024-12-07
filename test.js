import Axes from "./axes.js";

const axes = new Axes("canvas-container");
axes.setTickMarks(8);
axes.draw(1, 2, "blue");
axes.draw(-5, 5);
axes.draw(8, 8, "green");
axes.draw(0.5, 0, "aqua");
axes.draw(5, -3.5, "yellow");
axes.draw(-2.45, -5.23, "magenta");
axes.draw(0, 7);
