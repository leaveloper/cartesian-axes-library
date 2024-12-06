import Axes from "./axes.js";

const axes = new Axes("canvas-container");
axes.setTickMarks(10);
axes.draw(1, 2, "blue");
axes.draw(2, -2);
axes.draw(-5, 5);
axes.draw(-3, 9);
axes.draw(10, 10);
axes.draw(0.5, 0);
