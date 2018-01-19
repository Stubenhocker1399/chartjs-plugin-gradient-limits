// Plugin for drawing gradients representing different limits

const gradientLimitsPlugin = {
    gradientLimits: function (chartInstance, gl) {
        let ctx = chartInstance.chart.ctx;
        if (ctx.canvas.height !== 0 && ctx.canvas.width !== 0 || (ctx.canvas.height !== gl.lastHeight || ctx.canvas.width !== gl.lastWidth)) {
            // The limitDataset holds the limits as points, we use them to get the canvas coordinates
            let limitDatasetMeta = chartInstance.getDatasetMeta(gl.limitDataset);
            let yLimitCoordinates = [];
            for (let i = 0; i < limitDatasetMeta.data.length; i++) {
                yLimitCoordinates[i] = limitDatasetMeta.data[i]._model.y;
            }
            // Add legend lowest pixel coordinate to list to change it's border color to the charts neutral color
            yLimitCoordinates.push(chartInstance.legend.bottom - 10); //Shave a few pixels off to not start coloring points at the maximum
            const colors = gl.colors;
            if (yLimitCoordinates[0]) {
                let gradient = ctx.createLinearGradient(0, yLimitCoordinates[0], 0, yLimitCoordinates[yLimitCoordinates.length - 1]);
                let reducedNumber = yLimitCoordinates[0] - yLimitCoordinates[yLimitCoordinates.length - 1];
                gradient.addColorStop(0, colors[0]);
                gradient.addColorStop(0.01, colors[1]);
                for (let i = 1; i < yLimitCoordinates.length; i++) {
                    let reducedNumberi = yLimitCoordinates[i] - yLimitCoordinates[yLimitCoordinates.length - 1];
                    if (reducedNumberi < 0) {
                        reducedNumberi = 0;
                    }
                    if ((1 - (reducedNumberi / reducedNumber) - 0.01) > 0) {
                        gradient.addColorStop(1 - (reducedNumberi / reducedNumber) - 0.01, colors[i]);
                        gradient.addColorStop(1 - (reducedNumberi / reducedNumber), colors[i + 1]);
                    }
                }
                gradient.addColorStop(1, colors[yLimitCoordinates.length - 1]);
                for (let i = 0; i < gl.affectedDatasets.length; i++) {
                    let dataset = gl.affectedDatasets[i];
                    if (gl.borderColor) chartInstance.data.datasets[dataset].borderColor = gradient;
                    if (gl.backgroundColor) chartInstance.data.datasets[dataset].backgroundColor = gradient;
                    if (gl.pointBorderColor) chartInstance.data.datasets[dataset].pointBorderColor = gradient;
                    if (gl.pointBackgroundColor) chartInstance.data.datasets[dataset].pointBackgroundColor = gradient;
                    if (gl.pointHoverBorderColor) chartInstance.data.datasets[dataset].pointHoverBorderColor = gradient;
                    if (gl.pointHoverBackgroundColor) chartInstance.data.datasets[dataset].pointHoverBackgroundColor = gradient;
                }
            }
        }
        gl.lastHeight = ctx.canvas.height;
        gl.lastWidth = ctx.canvas.width;
    },

    //beforeDatasetUpdate // these work
    //afterDatasetUpdate
    beforeDatasetUpdate: function (chart) {
        if (chart.data.datasets.length < 1) {
            return;
        }
        if (chart.config.gradientLimits) {
            chart.config.gradientLimits.map(gl => {
                this.gradientLimits(chart, gl);
            });
        }
    }
};

Chart.plugins.register(gradientLimitsPlugin);