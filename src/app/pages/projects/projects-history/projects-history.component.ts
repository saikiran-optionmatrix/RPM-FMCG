import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface ProjectHistoryItem {
  projectCode: string;
  projectOwner: string;
  projectLead: string;
  molecule: string;
  productName: string;
  division: string;
  location: string;
  dosageForm: string;
  strength: string;
  targetMarket: string;
  estimatedCostForDevelopment: string;
  marketSizeInUsd: string;
  levelOfCompetition: string;
  competitorName: string;
  marketAccessStrategy: string;
  projectedMarketShare: string;
  projectedNpv: string;
  commercialAttractiveness: string;
  priorityOfProject: string;
  timelineForCompletionOfProject: string;
  projectInitiatedOn: string;
  productStatus: string;
  preEbActivitiesCompletedOn: string;
  tentativeBatchSize: string;
  tentativeEbBatchPlan: string;
  projectCompletedDate: string;
  expectedMaCost: string;
  drugAuthorityName: string;
  remarks: string;
  lastUpdated: string;
  updatedBy: string;
}

@Component({
  selector: 'app-projects-history',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './projects-history.component.html',
  styleUrl: './projects-history.component.scss',
})
export class ProjectsHistoryComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  projectName: string = 'Projects';
  projectCode: string = '';

  pageIndex: number = 0;
  pageSize: number = 10;

  historyRecords: ProjectHistoryItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['name']) {
        this.projectName = params['name'];
      }
      if (params['code']) {
        this.projectCode = params['code'];
      }
      this.initHistoryRecords();
    });
  }

  initHistoryRecords(): void {
    const code = this.projectCode || '2026/FMCG/006';
    const name = (this.projectName && this.projectName !== 'Projects') ? this.projectName : 'Vitamin-Enriched Fruit Beverage 250ml';

    this.historyRecords = [
      {
        projectCode: code,
        projectOwner: 'Ananya Rao',
        projectLead: 'Dr. Priya Raman',
        molecule: 'Multivitamin Complex + Zinc',
        productName: name,
        division: 'Beverage R&D',
        location: 'Bengaluru Innovation Centre',
        dosageForm: 'Ready-to-Drink Beverage',
        strength: '40 mg/0.8 mL',
        targetMarket: 'India (CDSCO) & ASEAN',
        estimatedCostForDevelopment: '$12,500,000',
        marketSizeInUsd: '$850M',
        levelOfCompetition: 'Moderate',
        competitorName: 'Tropicana, Minute Maid, Real Fruit Power',
        marketAccessStrategy: 'Retail FMCG & Modern Trade',
        projectedMarketShare: '18%',
        projectedNpv: '$14.2M',
        commercialAttractiveness: 'High',
        priorityOfProject: 'P1 - High',
        timelineForCompletionOfProject: '24 Months',
        projectInitiatedOn: '2025-01-15',
        productStatus: 'Initiated',
        preEbActivitiesCompletedOn: '-',
        tentativeBatchSize: '25,000 Litres',
        tentativeEbBatchPlan: 'Planned',
        projectCompletedDate: '2027-07-31',
        expectedMaCost: '$450,000',
        drugAuthorityName: 'FSSAI / CDSCO',
        remarks: 'Initial program charter approved and baseline established',
        lastUpdated: '15-Jan-2025',
        updatedBy: 'Ananya Rao'
      },
      {
        projectCode: code,
        projectOwner: 'Ananya Rao',
        projectLead: 'Dr. Priya Raman',
        molecule: 'Multivitamin Complex + Zinc',
        productName: name,
        division: 'Beverage R&D',
        location: 'Bengaluru Innovation Centre',
        dosageForm: 'Ready-to-Drink Beverage',
        strength: '40 mg/0.8 mL',
        targetMarket: 'India (CDSCO) & ASEAN',
        estimatedCostForDevelopment: '$12,500,000',
        marketSizeInUsd: '$850M',
        levelOfCompetition: 'Moderate',
        competitorName: 'Tropicana, Minute Maid, Real Fruit Power',
        marketAccessStrategy: 'Retail FMCG & Modern Trade',
        projectedMarketShare: '18%',
        projectedNpv: '$14.2M',
        commercialAttractiveness: 'High',
        priorityOfProject: 'P1 - High',
        timelineForCompletionOfProject: '24 Months',
        projectInitiatedOn: '2025-01-15',
        productStatus: 'Product Formulation and Product Optimization',
        preEbActivitiesCompletedOn: '2025-08-15',
        tentativeBatchSize: '50,000 Litres',
        tentativeEbBatchPlan: 'In Progress',
        projectCompletedDate: '2027-07-31',
        expectedMaCost: '$450,000',
        drugAuthorityName: 'FSSAI / CDSCO',
        remarks: 'Formulation recipe optimized; nutrient stability verified in pilot batches',
        lastUpdated: '15-Aug-2025',
        updatedBy: 'Dr. Priya Raman'
      },
      {
        projectCode: code,
        projectOwner: 'Ananya Rao',
        projectLead: 'Vikram Singh',
        molecule: 'Multivitamin Complex + Zinc',
        productName: name,
        division: 'Packaging & Engineering',
        location: 'Bengaluru Innovation Centre',
        dosageForm: 'Ready-to-Drink Beverage',
        strength: '40 mg/0.8 mL',
        targetMarket: 'India (CDSCO) & ASEAN',
        estimatedCostForDevelopment: '$12,500,000',
        marketSizeInUsd: '$850M',
        levelOfCompetition: 'Moderate',
        competitorName: 'Tropicana, Minute Maid, Real Fruit Power',
        marketAccessStrategy: 'Retail FMCG & Modern Trade',
        projectedMarketShare: '18%',
        projectedNpv: '$14.2M',
        commercialAttractiveness: 'High',
        priorityOfProject: 'P1 - High',
        timelineForCompletionOfProject: '24 Months',
        projectInitiatedOn: '2025-01-15',
        productStatus: 'Pilot Production Preparation',
        preEbActivitiesCompletedOn: '2025-11-20',
        tentativeBatchSize: '75,000 Litres',
        tentativeEbBatchPlan: 'Completed',
        projectCompletedDate: '2027-07-31',
        expectedMaCost: '$450,000',
        drugAuthorityName: 'FSSAI / CDSCO',
        remarks: 'Pilot trials executed successfully; PET aseptic line parameters locked',
        lastUpdated: '20-Nov-2025',
        updatedBy: 'Vikram Singh'
      },
      {
        projectCode: code,
        projectOwner: 'Ananya Rao',
        projectLead: 'Rajesh Kumar',
        molecule: 'Multivitamin Complex + Zinc',
        productName: name,
        division: 'Regulatory & Quality Affairs',
        location: 'Corporate HQ - Mumbai',
        dosageForm: 'Ready-to-Drink Beverage',
        strength: '40 mg/0.8 mL',
        targetMarket: 'India (CDSCO) & ASEAN',
        estimatedCostForDevelopment: '$12,500,000',
        marketSizeInUsd: '$850M',
        levelOfCompetition: 'Moderate',
        competitorName: 'Tropicana, Minute Maid, Real Fruit Power',
        marketAccessStrategy: 'Retail FMCG & Modern Trade',
        projectedMarketShare: '18%',
        projectedNpv: '$14.2M',
        commercialAttractiveness: 'High',
        priorityOfProject: 'P1 - High',
        timelineForCompletionOfProject: '24 Months',
        projectInitiatedOn: '2025-01-15',
        productStatus: 'Gate 2 Review / Filing Preparation',
        preEbActivitiesCompletedOn: '2026-02-10',
        tentativeBatchSize: '100,000 Litres',
        tentativeEbBatchPlan: 'Completed',
        projectCompletedDate: '2027-07-31',
        expectedMaCost: '$450,000',
        drugAuthorityName: 'FSSAI / CDSCO',
        remarks: 'Product and Manufacturing Transfer Dossier compiled; Gate 2 review readiness',
        lastUpdated: '10-Feb-2026',
        updatedBy: 'Rajesh Kumar'
      }
    ];
  }

  get paginatedRecords(): ProjectHistoryItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.historyRecords.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  scrollLeft(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: -350, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: 350, behavior: 'smooth' });
    }
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }
}
