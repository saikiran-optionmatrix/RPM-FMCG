import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-dashboard-buffer',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatSelectModule, MatIconModule],
  templateUrl: './dashboard-buffer.component.html',
  styleUrls: ['./dashboard-buffer.component.scss']
})
export class DashboardBufferComponent implements AfterViewInit {
  projects = [
    'New Beverage Product Development Program',
    'New Personal Care Product Formulation Development',
    'Multi-Variant Snack Product Development',
    'Ingredient Sourcing and Blend Optimization',
    'Shelf-Stable Powdered Beverage Product Formulation',
    'Vitamin-Enriched Fruit Beverage 250ml',
    'Premium Personal Care Lotion 200ml',
    'Ready-to-Eat Snack Range 100g',
    'Low-Sugar Dairy Beverage 200ml',
    'Plant-Based Protein Drink 300ml'
  ];
  selectedBufferProject = 'All Programs';

  selectedDivision: string = 'All';
  selectedLocation: string = 'All';

  readonly divisionsList: string[] = [
    'All',
    'Beverages - BV',
    'Personal Care & Beauty - PC',
    'Packaged Foods & Snacks - FS',
    'Dairy & Nutrition - DN',
    'Home Care - HC'
  ];

  readonly locationsList: string[] = [
    'All',
    'Mumbai',
    'Bengaluru',
    'Delhi NCR',
    'Pune',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Ahmedabad',
    'Baddi'
  ];

  onApplyFilters(): void {
    this.onBufferFilterChange();
  }

  bufferBarChart: Highcharts.Chart | null = null;
  bufferStageChart: Highcharts.Chart | null = null;

  readonly phaseDefinitions = [
    { key: 'Stage 0 – Target', fullName: 'Product Concept Selection & Business Case', threshold: 2.0 },
    { key: 'Stage 1 – Formula', fullName: 'Formula Design & Candidate Optimization', threshold: 4.5 },
    { key: 'Stage 2 – Process', fullName: 'Product Formulation & Pilot Process Development', threshold: 6.5 },
    { key: 'Stage 3 – Testing', fullName: 'Consumer Testing & Feasibility Studies', threshold: 8.5 },
    { key: 'Stage 4 – Launch', fullName: 'Commercial Scale-Up & Launch Preparation', threshold: 10.5 }
  ];

  bufferProjectData: { [project: string]: { [phase: string]: { bufferUsed: number; bufferTime: number } } } = {
    'New Beverage Product Development Program': {
      'Stage 0 – Target': { bufferUsed: 0.8, bufferTime: -0.3 },
      'Stage 1 – Formula': { bufferUsed: 2.3, bufferTime: -0.2 },
      'Stage 2 – Process': { bufferUsed: 4.4, bufferTime: 0.4 },
      'Stage 3 – Testing': { bufferUsed: 6.1, bufferTime: 0.8 },
      'Stage 4 – Launch': { bufferUsed: 8.0, bufferTime: 1.2 }
    },
    'New Personal Care Product Formulation Development': {
      'Stage 0 – Target': { bufferUsed: 0.7, bufferTime: -0.4 },
      'Stage 1 – Formula': { bufferUsed: 2.1, bufferTime: -0.3 },
      'Stage 2 – Process': { bufferUsed: 4.2, bufferTime: 0.2 },
      'Stage 3 – Testing': { bufferUsed: 5.9, bufferTime: 0.6 },
      'Stage 4 – Launch': { bufferUsed: 7.8, bufferTime: 0.9 }
    },
    'Multi-Variant Snack Product Development': {
      'Stage 0 – Target': { bufferUsed: 0.9, bufferTime: 0.2 },
      'Stage 1 – Formula': { bufferUsed: 2.5, bufferTime: 0.5 },
      'Stage 2 – Process': { bufferUsed: 4.8, bufferTime: 0.7 },
      'Stage 3 – Testing': { bufferUsed: 6.8, bufferTime: 1.1 },
      'Stage 4 – Launch': { bufferUsed: 8.9, bufferTime: 1.5 }
    },
    'Ingredient Sourcing and Blend Optimization': {
      'Stage 0 – Target': { bufferUsed: 0.6, bufferTime: -0.5 },
      'Stage 1 – Formula': { bufferUsed: 1.9, bufferTime: -0.4 },
      'Stage 2 – Process': { bufferUsed: 3.8, bufferTime: -0.1 },
      'Stage 3 – Testing': { bufferUsed: 5.5, bufferTime: 0.3 },
      'Stage 4 – Launch': { bufferUsed: 7.2, bufferTime: 0.6 }
    },
    'Shelf-Stable Powdered Beverage Product Formulation': {
      'Stage 0 – Target': { bufferUsed: 0.8, bufferTime: -0.1 },
      'Stage 1 – Formula': { bufferUsed: 2.4, bufferTime: 0.3 },
      'Stage 2 – Process': { bufferUsed: 4.6, bufferTime: 0.5 },
      'Stage 3 – Testing': { bufferUsed: 6.3, bufferTime: 0.9 },
      'Stage 4 – Launch': { bufferUsed: 8.2, bufferTime: 1.3 }
    },
    'Vitamin-Enriched Fruit Beverage 250ml': {
      'Stage 0 – Target': { bufferUsed: 0.8, bufferTime: -0.2 },
      'Stage 1 – Formula': { bufferUsed: 2.3, bufferTime: -0.1 },
      'Stage 2 – Process': { bufferUsed: 4.4, bufferTime: 0.3 },
      'Stage 3 – Testing': { bufferUsed: 6.1, bufferTime: 0.7 },
      'Stage 4 – Launch': { bufferUsed: 8.0, bufferTime: 1.0 }
    },
    'Premium Personal Care Lotion 200ml': {
      'Stage 0 – Target': { bufferUsed: 0.7, bufferTime: -0.3 },
      'Stage 1 – Formula': { bufferUsed: 2.2, bufferTime: -0.1 },
      'Stage 2 – Process': { bufferUsed: 4.3, bufferTime: 0.3 },
      'Stage 3 – Testing': { bufferUsed: 6.0, bufferTime: 0.6 },
      'Stage 4 – Launch': { bufferUsed: 7.9, bufferTime: 1.1 }
    },
    'Ready-to-Eat Snack Range 100g': {
      'Stage 0 – Target': { bufferUsed: 0.6, bufferTime: -0.4 },
      'Stage 1 – Formula': { bufferUsed: 2.0, bufferTime: -0.2 },
      'Stage 2 – Process': { bufferUsed: 4.1, bufferTime: 0.1 },
      'Stage 3 – Testing': { bufferUsed: 5.8, bufferTime: 0.5 },
      'Stage 4 – Launch': { bufferUsed: 7.6, bufferTime: 0.8 }
    },
    'Low-Sugar Dairy Beverage 200ml': {
      'Stage 0 – Target': { bufferUsed: 0.9, bufferTime: 0.1 },
      'Stage 1 – Formula': { bufferUsed: 2.6, bufferTime: 0.4 },
      'Stage 2 – Process': { bufferUsed: 4.7, bufferTime: 0.6 },
      'Stage 3 – Testing': { bufferUsed: 6.5, bufferTime: 1.0 },
      'Stage 4 – Launch': { bufferUsed: 8.5, bufferTime: 1.4 }
    },
    'Plant-Based Protein Drink 300ml': {
      'Stage 0 – Target': { bufferUsed: 0.8, bufferTime: -0.2 },
      'Stage 1 – Formula': { bufferUsed: 2.3, bufferTime: 0.1 },
      'Stage 2 – Process': { bufferUsed: 4.5, bufferTime: 0.4 },
      'Stage 3 – Testing': { bufferUsed: 6.2, bufferTime: 0.8 },
      'Stage 4 – Launch': { bufferUsed: 8.1, bufferTime: 1.2 }
    }
  };

  ngAfterViewInit() {
    setTimeout(() => {
      this.renderBufferBarChart();
      this.renderBufferPieChart();
    }, 0);
  }

  onBufferFilterChange() {
    this.renderBufferBarChart();
    this.renderBufferPieChart();
  }

  getBufferDataForProject(project: string): { [phase: string]: { bufferUsed: number; bufferTime: number } } {
    if (project !== 'All Programs' && this.bufferProjectData[project]) {
      return this.bufferProjectData[project];
    }
    const phases = this.phaseDefinitions.map(p => p.key);
    const projectKeys = Object.keys(this.bufferProjectData);
    const result: { [phase: string]: { bufferUsed: number; bufferTime: number } } = {};

    phases.forEach(phase => {
      let totalUsed = 0;
      let totalTime = 0;
      projectKeys.forEach(pk => {
        const item = this.bufferProjectData[pk]?.[phase];
        if (item) {
          totalUsed += item.bufferUsed;
          totalTime += item.bufferTime;
        }
      });
      const count = projectKeys.length || 1;
      result[phase] = {
        bufferUsed: parseFloat((totalUsed / count).toFixed(1)),
        bufferTime: parseFloat((totalTime / count).toFixed(1))
      };
    });

    return result;
  }

  renderBufferBarChart() {
    const container = document.getElementById('bufferBarChartContainer');
    if (!container) return;

    const data = this.getBufferDataForProject(this.selectedBufferProject);
    const categories = this.phaseDefinitions.map(p => p.key);
    const bufferUsedData = this.phaseDefinitions.map(p => data[p.key]?.bufferUsed ?? 0);
    const thresholdData = this.phaseDefinitions.map(p => p.threshold);
    const self = this;

    if (this.bufferBarChart) {
      this.bufferBarChart.destroy();
    }

    this.bufferBarChart = Highcharts.chart('bufferBarChartContainer', {
      chart: { type: 'column', backgroundColor: '#ffffff' },
      title: { text: null },
      credits: { enabled: false },
      exporting: { enabled: true },
      xAxis: {
        categories: categories,
        title: { text: 'Stages' },
        labels: {
          style: { fontSize: '11px' },
          formatter: function (this: any) {
            const def = self.phaseDefinitions.find(p => p.key === this.value);
            return `<span title="${def?.fullName || this.value}">${this.value}</span>`;
          }
        }
      },
      yAxis: {
        min: 0,
        max: 12,
        tickInterval: 2,
        title: { text: 'Buffer Time Used (days)' },
        plotLines: [{ value: 0, width: 1, color: '#ccd6eb' }]
      },
      tooltip: {
        shared: true,
        useHTML: true,
        formatter: function (this: any) {
          const def = self.phaseDefinitions.find(p => p.key === this.x);
          let s = `<b>${def?.fullName || this.x}</b><br/>`;
          this.points.forEach((point: any) => {
            s += `<span style="color:${point.series.color}">\u25CF</span> ${point.series.name}: <b>${point.y} days</b><br/>`;
          });
          return s;
        }
      },
      legend: { align: 'center', verticalAlign: 'bottom', layout: 'horizontal' },
      plotOptions: {
        column: {
          dataLabels: { enabled: true, format: '{y}' },
          maxPointWidth: 40
        },
        spline: {
          dataLabels: { enabled: false },
          enableMouseTracking: true
        }
      },
      series: [
        {
          name: 'Buffer Used',
          type: 'column',
          data: bufferUsedData,
          color: '#0d6efd'
        },
        {
          name: 'Average Threshold (y=x)',
          type: 'spline',
          data: thresholdData,
          color: '#198754',
          dashStyle: 'Dash',
          marker: { enabled: false }
        }
      ]
    } as any);
  }

  renderBufferPieChart() {
    const container = document.getElementById('bufferPieChartContainer');
    if (!container) return;

    const data = this.getBufferDataForProject(this.selectedBufferProject);
    const categories = this.phaseDefinitions.map(p => p.key);
    const bufferTimeData = this.phaseDefinitions.map(p => data[p.key]?.bufferTime ?? 0);
    const self = this;

    if (this.bufferStageChart) {
      this.bufferStageChart.destroy();
    }

    this.bufferStageChart = Highcharts.chart('bufferPieChartContainer', {
      chart: { type: 'column', backgroundColor: '#ffffff' },
      title: { text: null },
      credits: { enabled: false },
      exporting: { enabled: true },
      xAxis: {
        categories: categories,
        title: { text: 'Stages' },
        labels: {
          style: { fontSize: '11px' },
          formatter: function (this: any) {
            const def = self.phaseDefinitions.find(p => p.key === this.value);
            return `<span title="${def?.fullName || this.value}">${this.value}</span>`;
          }
        }
      },
      yAxis: {
        title: { text: 'Buffer Time (days)' },
        plotLines: [{ value: 0, width: 1, color: '#333333' }]
      },
      tooltip: {
        shared: true,
        useHTML: true,
        formatter: function (this: any) {
          const def = self.phaseDefinitions.find(p => p.key === this.x);
          let s = `<b>${def?.fullName || this.x}</b><br/>`;
          this.points.forEach((point: any) => {
            s += `<span style="color:${point.series.color}">\u25CF</span> ${point.series.name}: <b>${point.y} days</b><br/>`;
          });
          return s;
        }
      },
      legend: { align: 'center', verticalAlign: 'bottom', layout: 'horizontal' },
      plotOptions: {
        column: {
          dataLabels: { enabled: true, format: '{y}' },
          maxPointWidth: 40
        }
      },
      series: [
        {
          name: 'Buffer Time',
          type: 'column',
          data: bufferTimeData,
          color: '#0d6efd'
        }
      ]
    } as any);
  }
}
