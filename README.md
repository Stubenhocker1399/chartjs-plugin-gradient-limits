# chartjs-plugin-gradient-limits

This plugin displays different limits on a dataset via coloring the lines or points with a gradient.

https://stubenhocker1399.github.io/chartjs-plugin-gradient-limits/

## Notes

* Currently the code assumes that you have a legend displayed at the top position
* You need to keep track of your limit datasets separately and pass the proper indices
* There may be bugs

## Usage

There are three steps to using this plugin.

1. Add the limits you want as a dataset with `hidden: true`, take a note of their indices
2. Filter these limit datasets out from the legend via the label filter function
3. Add the gradientLimits key to your chart with the configuration as described below

# Example

        var dataChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June'],
                datasets: [{
                    // This dataset holds the limits
                    label: 'Limits', // This is not needed, but useful for debugging
                    hidden: true,
                    // Limits go from smallest to biggest
                    data: [3, 6, 15]
                },  {
                    label: 'Data 1',
                    backgroundColor: 'rgba(55, 55, 55, 0.2)',
                    borderColor: 'grey',
                    data: [12, 19, 3, 5, 2, 3],
                    borderWidth: 1,
                    fill: false
                }, {
                    label: 'Data 2',
                    backgroundColor: 'rgba(255, 195, 64, 0.2)',
                    borderColor: 'rgba(255,159,64,1)',
                    data: [0, 10, 5, 2, 20, 30],
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                legend: {
                    labels: {
                        filter: function (legendItem, chartData) {
                            // Hide all limit datasets by passing an array of indices
                            if ([0].indexOf(legendItem.datasetIndex) > -1)
                                return false;
                                else
                                return true;
                        }
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
            },
            gradientLimits: [{
                // Store the limits in a dataset and give the index here
                limitDataset: 0,
                // The datasets which these limits apply for
                affectedDatasets: [1, 2],
                // Colors for the different limits, from bottom to top. The last color should be 
                // the same as the neutral color for the graph, as it colors the border of the legend.
                colors: [ 'turquoise', 'yellow', 'grey', 'salmon', 'grey'],
                // What part of the graph should be affected by the gradient
                borderColor: true,
                pointBorderColor: true,
                pointBackgroundColor: true,
                pointHoverBackgroundColor: true,
                pointHoverBorderColor: true
            }]
        });