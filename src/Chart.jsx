import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
const Chart = () => {
    const [chartData, setChartData] = useState({
        series: [],
        options: {
            chart: {
                height: 350,
                type: 'line',
                zoom: {
                    enabled: false
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'straight'
            },
            title: {
                text: 'Total Requests by Department',
                align: 'left'
            },
            xaxis: {
                categories: []
            },
            yaxis: {
                min: 0
            }
        }
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('https://checkinn.co/api/v1/int/requests');
            const data = await response.json();

            if (data && data.requests && data.requests.length > 0) {
                const departmentCounts = {};

                data.requests.forEach(request => {
                    const department = request.desk.name;
                    if (departmentCounts[department]) {
                        departmentCounts[department]++;
                    } else {
                        departmentCounts[department] = 1;
                    }
                });

                const categories = Object.keys(departmentCounts);
                const seriesData = categories.map(category => departmentCounts[category]);

                setChartData(prevState => ({
                    ...prevState,
                    series: [{
                        name: 'Total Requests',
                        data: seriesData
                    }],
                    options: {
                        ...prevState.options,
                        xaxis: {
                            categories: categories
                        }
                    }
                }));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    return (
        <>
            <ReactApexChart options={chartData.options} series={chartData.series} type="line" height={350} />
        </>
    )
}

export default Chart