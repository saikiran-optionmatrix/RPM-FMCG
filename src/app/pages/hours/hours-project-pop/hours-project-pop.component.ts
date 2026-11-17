import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface ProjectPopItem {
  sNo: number;
  projectCode: string;
  projectName: string;
}

@Component({
  selector: 'app-hours-project-pop',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './hours-project-pop.component.html',
  styleUrl: './hours-project-pop.component.scss'
})
export class HoursProjectPopComponent implements OnInit {
  projects: ProjectPopItem[] = [
    { sNo: 1, projectCode: '2026/FMCG/001', projectName: 'Vitamin-Enriched Fruit Beverage 250ml' },
    { sNo: 2, projectCode: '2026/FMCG/002', projectName: 'Probiotic Greek Yogurt 150g' },
    { sNo: 3, projectCode: '2026/FMCG/003', projectName: 'Sustainable Barrier Snack Pouch 50g' }
  ];

  constructor(
    public dialogRef: MatDialogRef<HoursProjectPopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data?.projects && Array.isArray(this.data.projects)) {
      this.projects = this.data.projects;
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
