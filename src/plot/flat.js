import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';

export default class flat extends React.Component {
    static propTypes = {
        className: PropTypes.string,

        points: PropTypes.arrayOf(PropTypes.any),

        onClick: PropTypes.func,
    }

    static defaultProps = {
        className: '',

        points: [],

        onClick: () => {},
    }

    constructor(props) {
        super(props);
    
        this.state = {
            data: this.transformPointsToData(props.points),
        };

        this.clickHandler = this.clickHandler.bind(this);

        this.getPoint = this.getPoint.bind(this);

        this.tooltipTitleCallback = this.tooltipTitleCallback.bind(this);
        this.tooltipBeforeLabelCallback = this.tooltipBeforeLabelCallback.bind(this);
        this.tooltipLabelCallback = this.tooltipLabelCallback.bind(this);
        this.tooltipAfterLabelCallback = this.tooltipAfterLabelCallback.bind(this);
    }
    
    transformPointsToData(points) {
        if (!points || !points.length || points.length <= 0 ) return [];

        const data = {
            labels: points.map(p => {
                return `${(`0${p.time.h}`).slice(-2)}:${(`0${p.time.m}`).slice(-2)}:${(`0${p.time.s}`).slice(-2)}`;
            }),
            datasets: [
                {
                    label: 'Altitudes (pression)',
                    fill: false,
                    lineTension: 1,
                    backgroundColor: 'rgba(204,255,204,0.4)',
                    borderColor: 'rgba(204,255,204,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(204,255,204,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(204,255,204,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 1,
                    data: points.map(p => p.pressalt),
                },
                {
                    label: 'Altitudes (GPS)',
                    fill: false,
                    lineTension: 1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 1,
                    data: points.map(p => p.gpsalt),
                },
            ],
        };

        return data;
    }

    tooltipTitleCallback(tooltipItem, data) {
        const { index } = tooltipItem[0];
        return `Time : ${data.labels[index]}`;
    }

    getPoint(index) {
        if (index < 0 || index > this.state.data.length) return;

        return this.props.points[index];
    }

    reducer(a, b) {
        if (!a)
            return b;
        return `${a}\n${b}`;
    }
    
    tooltipBeforeLabelCallback(tooltipItem, data) {
        const point = this.getPoint(tooltipItem.index);
        const lines = [];
        lines.push(`Altitude (pression) : ${point.pressalt.toFixed(2)}`)
        lines.push(`Altitude (GPS) : ${point.gpsalt.toFixed(2)}`)
        return lines.reduce(this.reducer);
    }

    tooltipLabelCallback(tooltipItem, data) {
        const point = this.getPoint(tooltipItem.index);
        return `Latitude : ${point.lat.toFixed(4)}`;
    }

    tooltipAfterLabelCallback(tooltipItem, data) {
        const point = this.getPoint(tooltipItem.index);
        const lines = [];
        lines.push(`Longitude : ${point.lng.toFixed(2)}`)
        lines.push(`Speed : ${point.speed.toFixed(2)}`)
        return lines.reduce(this.reducer);
    }

    clickHandler(data) {
        if (!data || !data.length || data.length <= 0) return;

        const index = data[0]._index;
        if (index < 0 || index > this.state.data.length) return;

        const elementClicked = this.props.points[index];

        this.props.onClick(elementClicked);
    }

    render() {
        const { data } = this.state;
        return (
            <div className={this.props.className}>
                {
                    data
                    && <Line
                        onElementsClick={this.clickHandler}
                        data={data}
                        className={this.props.className}
                        options= {{
                            tooltips: {
                                mode: 'nearest',
                                displayColors: false,
                                callbacks: {
                                    title: this.tooltipTitleCallback,
                                    label: this.tooltipLabelCallback,
                                    beforeLabel: this.tooltipBeforeLabelCallback,
                                    afterLabel: this.tooltipAfterLabelCallback,
                                },
                            },
                            animation: {
                                duration: 0,
                            },
                            responsive: true,
                            maintainAspectRatio: false,
                        }}
                        redraw
                    />
                }
            </div>
        );
    }
}
