import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AddDocumentComponent } from './add-document/add-document.component';
import { ConfirmationDialogComponent } from '../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { DocumentsPopComponent } from '../../../../common/shared/documents-pop/documents-pop.component';
import { ViewDocsComponent } from './view-docs/view-docs.component';

export interface TaskDocumentItem {
  id: string | number;
  stageName: string;
  deliverableName: string;
  activityName: string;
  taskName: string;
  documentsCount: number;
  documents?: { id: number; title: string; uploadedDate?: string }[];
}

export interface GateDocumentItem {
  id: string | number;
  gateCode: string;
  gateName: string;
  documentTitle: string;
  uploadedDate?: string;
  uploadedBy?: string;
}

export interface ActivityNode {
  id: string | number;
  name: string;
  jobCode?: string;
  tasks: TaskDocumentItem[];
}

export interface DeliverableNode {
  id: string | number;
  name: string;
  expanded?: boolean;
  activities: ActivityNode[];
}

export interface StageNode {
  id: string | number;
  type: 'stage';
  stageCode: string;
  stageName: string;
  gateCode?: string;
  expanded?: boolean;
  deliverables: DeliverableNode[];
}

export interface GateNode {
  id: string | number;
  type: 'gate';
  gateCode: string;
  gateName: string;
  documents: GateDocumentItem[];
}

export type TreeNode = StageNode | GateNode;

@Component({
  selector: 'app-project-documents',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './project-documents.component.html',
  styleUrl: './project-documents.component.scss'
})
export class ProjectDocumentsComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  projectName: string = 'Vitamin-Enriched Fruit Beverage 250ml';
  projectCode: string = '2026/FMCG/006';

  // Filter dropdown: All, Stages, Gates
  selectedFilter: 'All' | 'Stages' | 'Gates' = 'All';

  // Tree Nodes
  allTreeNodes: TreeNode[] = [];
  filteredTreeNodes: TreeNode[] = [];

  // Currently selected item: can be 'stage', 'deliverable', 'activity', or 'gate'
  selectedItemType: 'stage' | 'deliverable' | 'activity' | 'gate' = 'stage';
  selectedStage: StageNode | null = null;
  selectedDeliverable: DeliverableNode | null = null;
  selectedActivity: ActivityNode | null = null;
  selectedGate: GateNode | null = null;

  // Active table datasets
  currentActivityTasks: TaskDocumentItem[] = [];
  filteredActivityTasks: TaskDocumentItem[] = [];

  currentGateDocuments: GateDocumentItem[] = [];
  filteredGateDocuments: GateDocumentItem[] = [];

  // Search keyword for table rows
  tableSearchKeyword: string = '';

  // Pagination matching AssetsComponent
  pageIndex: number = 0;
  pageSize: number = 10;

  get paginatedActivityTasks(): TaskDocumentItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredActivityTasks.slice(startIndex, startIndex + this.pageSize);
  }

  get paginatedGateDocuments(): GateDocumentItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredGateDocuments.slice(startIndex, startIndex + this.pageSize);
  }

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
    });

    this.initMasterTreeData();
    this.applyTreeFilter();

    // Default select Stage 1 (Business Case) so all its tasks appear in the grid
    this.setDefaultSelection();
  }

  private initMasterTreeData(): void {
    // 1. Stage 1: Business Case
    const stage1: StageNode = {
      id: 'S1',
      type: 'stage',
      stageCode: 'S1', stageName: 'Business Case',
      gateCode: '-',
      expanded: true,
      deliverables: [
        {
          id: 'D1-1',
          name: 'Business Case Preparation & Commercial Feasibility',
          expanded: true,
          activities: [
            {
              id: 'A1-1',
              name: 'Market Sizing & Commercial Modeling',
              jobCode: 'ACT1',
              tasks: [
                {
                  id: 'T1-1',
                  stageName: 'Business Case',
                  deliverableName: 'Business Case Preparation & Commercial Feasibility',
                  activityName: 'Market Sizing & Commercial Modeling',
                  taskName: 'Market opportunity assessment & reference product sales review',
                  documentsCount: 4,
                  documents: [
                    { id: 1, title: 'Reference_Product_Sales_Review.pdf', uploadedDate: '2026-01-08' },
                    { id: 2, title: 'Commercial_Model_v2.xlsx', uploadedDate: '2026-01-09' },
                    { id: 3, title: 'FMCG_Market_Overview.pdf', uploadedDate: '2026-01-10' },
                    { id: 4, title: 'Market_Share_Simulation.pdf', uploadedDate: '2026-01-11' }
                  ]
                },
                {
                  id: 'T1-2',
                  stageName: 'Business Case',
                  deliverableName: 'Business Case Preparation & Commercial Feasibility',
                  activityName: 'Market Sizing & Commercial Modeling',
                  taskName: 'FMCG market and competitor landscape and patent / data exclusivity mapping',
                  documentsCount: 3,
                  documents: [
                    { id: 1, title: 'Competitor_Pipeline_Analysis.pdf', uploadedDate: '2026-01-12' },
                    { id: 2, title: 'Patent_Exclusivity_Mapping.pdf', uploadedDate: '2026-01-13' },
                    { id: 3, title: 'IP_Freedom_To_Operate_Review.pdf', uploadedDate: '2026-01-14' }
                  ]
                },
                {
                  id: 'T1-3',
                  stageName: 'Business Case',
                  deliverableName: 'Business Case Preparation & Commercial Feasibility',
                  activityName: 'Market Sizing & Commercial Modeling',
                  taskName: 'Pricing strategy and tender / payer net price projection',
                  documentsCount: 2,
                  documents: [
                    { id: 1, title: 'Pricing_Strategy_Draft.pdf', uploadedDate: '2026-01-14' },
                    { id: 2, title: 'Net_Price_Projection_Model.xlsx', uploadedDate: '2026-01-15' }
                  ]
                }
              ]
            },
            {
              id: 'A1-2',
              name: 'Financial Evaluation & NPV Calculation',
              jobCode: 'ACT2',
              tasks: [
                {
                  id: 'T1-4',
                  stageName: 'Business Case',
                  deliverableName: 'Business Case Preparation & Commercial Feasibility',
                  activityName: 'Financial Evaluation & NPV Calculation',
                  taskName: 'NPV & IRR discounted cash flow forecast',
                  documentsCount: 3,
                  documents: [
                    { id: 1, title: 'DCF_Valuation_Model.xlsx', uploadedDate: '2026-01-12' },
                    { id: 2, title: 'Sensitivity_Analysis_Summary.pdf', uploadedDate: '2026-01-13' },
                    { id: 3, title: 'Executive_Finance_Signoff.pdf', uploadedDate: '2026-01-14' }
                  ]
                },
                {
                  id: 'T1-5',
                  stageName: 'Business Case',
                  deliverableName: 'Business Case Preparation & Commercial Feasibility',
                  activityName: 'Financial Evaluation & NPV Calculation',
                  taskName: 'Capex, Opex and CDMO / manufacturing budget validation',
                  documentsCount: 2,
                  documents: [
                    { id: 1, title: 'Capex_Requisition_Approval.pdf', uploadedDate: '2026-01-14' },
                    { id: 2, title: 'CDMO_Budget_Validation.pdf', uploadedDate: '2026-01-15' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };

    // 2. Stage 2: Initiation
    const stage2: StageNode = {
      id: 'S2',
      type: 'stage',
      stageCode: 'S2',
      stageName: 'Initiation',
      gateCode: 'Gate 1',
      expanded: false,
      deliverables: [
        {
          id: 'D2-1',
          name: 'Program Costing Sheet Preparation & CDMO Selection',
          expanded: false,
          activities: [
            {
              id: 'A2-1',
              name: 'Analytical Costing & External third-party testing and research partner Costing',
              jobCode: 'ACT4',
              tasks: [
                {
                  id: 'T2-1',
                  stageName: 'Initiation',
                  deliverableName: 'Program Costing Sheet Preparation & CDMO Selection',
                  activityName: 'Analytical Costing & External third-party testing and research partner Costing',
                  taskName: 'Analytical characterization & product performance and quality test third-party testing and research partner proposal evaluation',
                  documentsCount: 4,
                  documents: [
                    { id: 1, title: 'Testing_Partner_Proposal.pdf', uploadedDate: '2026-01-18' },
                    { id: 2, title: 'Analytical_Cost_Comparison.xlsx', uploadedDate: '2026-01-19' },
                    { id: 3, title: 'Instrumentation_Audit.pdf', uploadedDate: '2026-01-20' },
                    { id: 4, title: 'Scope_of_Work_Analytical.pdf', uploadedDate: '2026-01-20' }
                  ]
                },
                {
                  id: 'T2-2',
                  stageName: 'Initiation',
                  deliverableName: 'Program Costing Sheet Preparation & CDMO Selection',
                  activityName: 'Analytical Costing & External third-party testing and research partner Costing',
                  taskName: 'Method transfer and verification quote review',
                  documentsCount: 2,
                  documents: [
                    { id: 1, title: 'Method_Transfer_Quote.pdf', uploadedDate: '2026-01-20' },
                    { id: 2, title: 'Technical_Agreement_Draft.pdf', uploadedDate: '2026-01-21' }
                  ]
                }
              ]
            },
            {
              id: 'A2-2',
              name: 'Raw Material and Packaging Material, packaging substrate & Reference Product Costing Breakdown',
              jobCode: 'ACT5',
              tasks: [
                {
                  id: 'T2-3',
                  stageName: 'Initiation',
                  deliverableName: 'Program Costing Sheet Preparation & CDMO Selection',
                  activityName: 'Raw Material and Packaging Material, packaging substrate & Reference Product Costing Breakdown',
                  taskName: 'Reference product lot receipt, cold-chain & customs clearance documentation',
                  documentsCount: 3,
                  documents: [
                    { id: 1, title: 'Reference_Product_Customs_Declaration.pdf', uploadedDate: '2026-01-21' },
                    { id: 2, title: 'Cold_Chain_Receipt_Log.pdf', uploadedDate: '2026-01-22' },
                    { id: 3, title: 'Inspection_Checklist_Reference.pdf', uploadedDate: '2026-01-22' }
                  ]
                },
                {
                  id: 'T2-4',
                  stageName: 'Initiation',
                  deliverableName: 'Program Costing Sheet Preparation & CDMO Selection',
                  activityName: 'Raw Material and Packaging Material, packaging substrate & Reference Product Costing Breakdown',
                  taskName: 'Bill of Materials (BOM) packaging substrate, resin & consumables quote consolidation',
                  documentsCount: 2,
                  documents: [
                    { id: 1, title: 'Consolidated_BOM_Packaging_Quotes.xlsx', uploadedDate: '2026-01-23' },
                    { id: 2, title: 'Supplier_Price_Commitment.pdf', uploadedDate: '2026-01-24' }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'D2-2',
          name: 'Program Initiation Form (PIF)',
          expanded: false,
          activities: [
            {
              id: 'A2-3',
              name: 'PIF Draft & Cross-Functional Sign-Off',
              jobCode: 'ACT6',
              tasks: [
                {
                  id: 'T2-5',
                  stageName: 'Initiation',
                  deliverableName: 'Program Initiation Form (PIF)',
                  activityName: 'PIF Draft & Cross-Functional Sign-Off',
                  taskName: 'PIF final draft compilation & QA approval',
                  documentsCount: 3,
                  documents: [
                    { id: 1, title: 'PIF_Final_Signed_Copy.pdf', uploadedDate: '2026-01-25' },
                    { id: 2, title: 'Formulation_Alignment_Memo.pdf', uploadedDate: '2026-01-25' },
                    { id: 3, title: 'Quality_Risk_Assessment.pdf', uploadedDate: '2026-01-25' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };

    // 3. Gate 1: Feasibility & Charter
    const gate1: GateNode = {
      id: 'G1',
      type: 'gate',
      gateCode: 'Gate 1', gateName: 'Feasibility & Charter',
      documents: [
        { id: 'GD1-1', gateCode: 'Gate 1', gateName: 'Feasibility & Charter', documentTitle: 'Formal Freedom-to-Operate (FTO) Legal Opinion', uploadedDate: '2026-01-15', uploadedBy: 'Legal Counsel' },
        { id: 'GD1-2', gateCode: 'Gate 1', gateName: 'Feasibility & Charter', documentTitle: 'product formulation Source & Primary CDMO Qualification Report', uploadedDate: '2026-01-15', uploadedBy: 'Procurement PMO' },
        { id: 'GD1-3', gateCode: 'Gate 1', gateName: 'Feasibility & Charter', documentTitle: 'Reference Product Analytical Characterization Protocol', uploadedDate: '2026-01-14', uploadedBy: 'Formulation Lead' },
        { id: 'GD1-4', gateCode: 'Gate 1', gateName: 'Feasibility & Charter', documentTitle: 'Target Product Profile (TPP) and QTPP Baseline Document', uploadedDate: '2026-01-13', uploadedBy: 'Product Management' },
        { id: 'GD1-5', gateCode: 'Gate 1', gateName: 'Feasibility & Charter', documentTitle: 'Biologics Cost of Goods Sold (COGS) Feasibility Summary', uploadedDate: '2026-01-12', uploadedBy: 'Finance Controller' },
        { id: 'GD1-6', gateCode: 'Gate 1', gateName: 'Feasibility & Charter', documentTitle: 'Gate 1 Steering Committee Approval Resolution', uploadedDate: '2026-01-15', uploadedBy: 'Steering Committee' }
      ]
    };

    // 4. Stage 3: product formulation & food-grade ingredient / processing aid Procurement
    const stage3: StageNode = {
      id: 'S3',
      type: 'stage',
      stageCode: 'S3',
      stageName: 'product formulation & food-grade ingredient / processing aid Procurement',
      gateCode: '-',
      expanded: false,
      deliverables: [
        {
          id: 'D3-1',
          name: 'Developmental Material Procurement & Release',
          expanded: false,
          activities: [
            {
              id: 'A3-1',
              name: 'Active Ingredient Sourcing & Supplier Qualification',
              jobCode: 'ACT7',
              tasks: [
                {
                  id: 'T3-1',
                  stageName: 'product formulation Procurement',
                  deliverableName: 'Developmental Material Procurement & Release',
                  activityName: 'Active Ingredient Sourcing & Supplier Qualification',
                  taskName: 'Active ingredient documentation review and qualification audit',
                  documentsCount: 4,
                  documents: [
                    { id: 1, title: 'Ingredient_Specification_Dossier.pdf', uploadedDate: '2026-02-01' },
                    { id: 2, title: 'Supplier_Audit_Report.pdf', uploadedDate: '2026-02-03' },
                    { id: 3, title: 'Food_Safety_Certificate.pdf', uploadedDate: '2026-02-05' },
                    { id: 4, title: 'Letter_of_Access_LOA.pdf', uploadedDate: '2026-02-06' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };

    // 5. Stage 4: POC Expression & ingredient refining
    const stage4: StageNode = {
      id: 'S4',
      type: 'stage',
      stageCode: 'S4',
      stageName: 'POC Expression & ingredient refining',
      gateCode: 'Gate 2',
      expanded: false,
      deliverables: [
        {
          id: 'D4-1',
          name: 'Proof of Concept (POC) Formulation Trials',
          expanded: false,
          activities: [
            {
              id: 'A4-1',
              name: 'Formula Consistency & Stability Trials',
              jobCode: 'ACT8',
              tasks: [
                {
                  id: 'T4-1',
                  stageName: 'POC Expression & ingredient refining',
                  deliverableName: 'Proof of Concept (POC) Formulation Trials',
                  activityName: 'Formula Consistency & Stability Trials',
                  taskName: 'Batch stability testing & sensory compatibility',
                  documentsCount: 3,
                  documents: [
                    { id: 1, title: 'Formulation_Trial_Protocol.pdf', uploadedDate: '2026-03-01' },
                    { id: 2, title: 'Sensory_Evaluation_Curves.pdf', uploadedDate: '2026-03-10' },
                    { id: 3, title: 'Stability_Study_Report.pdf', uploadedDate: '2026-03-20' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };

    // 6. Gate 2: Product Concept and Formula Selection
    const gate2: GateNode = {
      id: 'G2',
      type: 'gate',
      gateCode: 'Gate 2', gateName: 'Product Concept and Formula Selection',
      documents: [
        { id: 'GD2-1', gateCode: 'Gate 2', gateName: 'Product Concept and Formula Selection', documentTitle: 'formula consistency and Productivity Summary Report', uploadedDate: '2026-05-10', uploadedBy: 'Formulation Scientist' },
        { id: 'GD2-2', gateCode: 'Gate 2', gateName: 'Product Concept and Formula Selection', documentTitle: 'Candidate Process Titer and Quality Attributes Report', uploadedDate: '2026-05-12', uploadedBy: 'Process Lead' },
        { id: 'GD2-3', gateCode: 'Gate 2', gateName: 'Product Concept and Formula Selection', documentTitle: 'Preliminary Analytical Similarity Data Package', uploadedDate: '2026-05-15', uploadedBy: 'Analytical Lead' },
        { id: 'GD2-4', gateCode: 'Gate 2', gateName: 'Product Concept and Formula Selection', documentTitle: 'Master ingredient specification (MCB) Plan', uploadedDate: '2026-05-18', uploadedBy: 'Quality Assurance' },
        { id: 'GD2-5', gateCode: 'Gate 2', gateName: 'Product Concept and Formula Selection', documentTitle: 'Developability and Cost of Goods Sold (COGS) Update', uploadedDate: '2026-05-20', uploadedBy: 'Finance Lead' },
        { id: 'GD2-6', gateCode: 'Gate 2', gateName: 'Product Concept and Formula Selection', documentTitle: 'Gate 2 Steering Committee Approval Resolution', uploadedDate: '2026-05-22', uploadedBy: 'Project Steering Committee' }
      ]
    };

    // 7. Stage 5: GMP production batch Material Procurement
    const stage5: StageNode = {
      id: 'S5',
      type: 'stage',
      stageCode: 'S5',
      stageName: 'GMP production batch Material Procurement',
      gateCode: '-',
      expanded: false,
      deliverables: []
    };

    // 8. Stage 6: pilot manufacturing run
    const stage6: StageNode = {
      id: 'S6',
      type: 'stage',
      stageCode: 'S6',
      stageName: 'pilot manufacturing run',
      gateCode: 'Gate 3',
      expanded: false,
      deliverables: []
    };

    // 9. Gate 3: Product Concept and Feasibility Approval
    const gate3: GateNode = {
      id: 'G3',
      type: 'gate',
      gateCode: 'Gate 3', gateName: 'Product Concept and Feasibility Approval',
      documents: []
    };

    // 10. Stage 7: bulk product Validation
    const stage7: StageNode = {
      id: 'S7',
      type: 'stage',
      stageCode: 'S7',
      stageName: 'bulk product Validation',
      gateCode: '-',
      expanded: false,
      deliverables: []
    };

    // 11. Stage 8: finished consumer product Validation
    const stage8: StageNode = {
      id: 'S8',
      type: 'stage',
      stageCode: 'S8',
      stageName: 'finished consumer product Validation',
      gateCode: '-',
      expanded: false,
      deliverables: []
    };

    // 12. Stage 9: Product and Manufacturing Transfer Dossier Submission
    const stage9: StageNode = {
      id: 'S9',
      type: 'stage',
      stageCode: 'S9',
      stageName: 'Product and Manufacturing Transfer Dossier Submission',
      gateCode: '-',
      expanded: false,
      deliverables: []
    };

    // 13. Stage 10: GMP validation batches
    const stage10: StageNode = {
      id: 'S10',
      type: 'stage',
      stageCode: 'S10',
      stageName: 'GMP validation batches',
      gateCode: 'Gate 4',
      expanded: false,
      deliverables: []
    };

    // 14. Gate 4: Consumer Validation and Product Performance Proof
    const gate4: GateNode = {
      id: 'G4',
      type: 'gate',
      gateCode: 'Gate 4', gateName: 'Consumer Validation and Product Performance Proof',
      documents: []
    };

    // 15. Stage 11: Pivotal Comparative consumer and market Study
    const stage11: StageNode = {
      id: 'S11',
      type: 'stage',
      stageCode: 'S11',
      stageName: 'Pivotal Comparative consumer and market Study',
      gateCode: 'Gate 5',
      expanded: false,
      deliverables: []
    };

    // 16. Gate 5: Market Launch and Regulatory Readiness
    const gate5: GateNode = {
      id: 'G5',
      type: 'gate',
      gateCode: 'Gate 5', gateName: 'Market Launch and Regulatory Readiness',
      documents: []
    };

    // 17. Stage 12: Market Launch / Regulatory Approval Dossier Filing
    const stage12: StageNode = {
      id: 'S12',
      type: 'stage',
      stageCode: 'S12',
      stageName: 'Market Launch / Regulatory Approval Dossier Filing',
      gateCode: '-',
      expanded: false,
      deliverables: []
    };

    // Construct master array in sequence matching FMCG master list
    this.allTreeNodes = [
      stage1,
      stage2,
      gate1,
      stage3,
      stage4,
      gate2,
      stage5,
      stage6,
      gate3,
      stage7,
      stage8,
      stage9,
      stage10,
      gate4,
      stage11,
      gate5,
      stage12
    ];
  }

  onFilterChange(): void {
    this.applyTreeFilter();
  }

  private applyTreeFilter(): void {
    if (this.selectedFilter === 'All') {
      this.filteredTreeNodes = [...this.allTreeNodes];
    } else if (this.selectedFilter === 'Stages') {
      this.filteredTreeNodes = this.allTreeNodes.filter(node => node.type === 'stage');
    } else if (this.selectedFilter === 'Gates') {
      this.filteredTreeNodes = this.allTreeNodes.filter(node => node.type === 'gate');
    }

    // Ensure valid current selection after filtering
    if (this.selectedFilter === 'Gates' && this.selectedItemType !== 'gate') {
      const firstGate = this.filteredTreeNodes.find(n => n.type === 'gate') as GateNode;
      if (firstGate) {
        this.selectGate(firstGate);
      }
    } else if (this.selectedFilter === 'Stages' && this.selectedItemType === 'gate') {
      const firstStage = this.filteredTreeNodes.find(n => n.type === 'stage') as StageNode;
      if (firstStage) {
        this.selectStage(firstStage, false);
      }
    }
  }

  private setDefaultSelection(): void {
    const stage1 = this.allTreeNodes[0] as StageNode;
    if (stage1) {
      stage1.expanded = true;
      if (stage1.deliverables.length > 0) {
        stage1.deliverables[0].expanded = true;
      }
      this.selectStage(stage1, false);
    }
  }

  // Click on Stage button: selects Stage and loads ALL its tasks across all deliverables & activities
  selectStage(stage: StageNode, toggle: boolean = true): void {
    if (toggle) {
      stage.expanded = !stage.expanded;
    } else {
      stage.expanded = true;
    }
    this.selectedItemType = 'stage';
    this.selectedStage = stage;
    this.selectedDeliverable = null;
    this.selectedActivity = null;
    this.selectedGate = null;

    // Aggregate all tasks across all deliverables and activities in this stage
    const allStageTasks: TaskDocumentItem[] = [];
    stage.deliverables?.forEach(deliv => {
      deliv.activities?.forEach(act => {
        if (act.tasks) {
          allStageTasks.push(...act.tasks);
        }
      });
    });
    this.currentActivityTasks = allStageTasks;
    this.pageIndex = 0;
    this.filterTableData();
  }

  // Toggle stage expand/collapse specifically from the chevron arrow
  toggleStageArrow(event: Event, stage: StageNode): void {
    event.stopPropagation();
    stage.expanded = !stage.expanded;
  }

  // Click on Deliverable button: selects Deliverable and loads ALL its tasks across all activities
  selectDeliverable(deliv: DeliverableNode, stage: StageNode, toggle: boolean = true): void {
    if (toggle) {
      deliv.expanded = !deliv.expanded;
    } else {
      deliv.expanded = true;
    }
    this.selectedItemType = 'deliverable';
    this.selectedStage = stage;
    this.selectedDeliverable = deliv;
    this.selectedActivity = null;
    this.selectedGate = null;

    // Aggregate all tasks across all activities in this deliverable
    const allDelivTasks: TaskDocumentItem[] = [];
    deliv.activities?.forEach(act => {
      if (act.tasks) {
        allDelivTasks.push(...act.tasks);
      }
    });
    this.currentActivityTasks = allDelivTasks;
    this.pageIndex = 0;
    this.filterTableData();
  }

  // Toggle deliverable expand/collapse specifically from the chevron arrow
  toggleDeliverableArrow(event: Event, deliv: DeliverableNode): void {
    event.stopPropagation();
    deliv.expanded = !deliv.expanded;
  }

  // Click on Activity button: selects Activity and displays its tasks
  selectActivity(act: ActivityNode, deliv: DeliverableNode, stage: StageNode): void {
    this.selectedItemType = 'activity';
    this.selectedStage = stage;
    this.selectedDeliverable = deliv;
    this.selectedActivity = act;
    this.selectedGate = null;
    this.currentActivityTasks = act.tasks || [];
    this.pageIndex = 0;
    this.filterTableData();
  }

  // Click on Gate button: selects Gate and displays its documents
  selectGate(gate: GateNode): void {
    this.selectedItemType = 'gate';
    this.selectedGate = gate;
    this.selectedStage = null;
    this.selectedDeliverable = null;
    this.selectedActivity = null;
    this.currentGateDocuments = gate.documents || [];
    this.pageIndex = 0;
    this.filterTableData();
  }

  // Filter table rows by search keyword
  filterTableData(): void {
    const kw = this.tableSearchKeyword.toLowerCase().trim();
    if (this.selectedItemType === 'gate') {
      if (!kw) {
        this.filteredGateDocuments = [...this.currentGateDocuments];
      } else {
        this.filteredGateDocuments = this.currentGateDocuments.filter(doc =>
          doc.gateName.toLowerCase().includes(kw) ||
          doc.gateCode.toLowerCase().includes(kw) ||
          doc.documentTitle.toLowerCase().includes(kw)
        );
      }
    } else {
      if (!kw) {
        this.filteredActivityTasks = [...this.currentActivityTasks];
      } else {
        this.filteredActivityTasks = this.currentActivityTasks.filter(item =>
          item.stageName.toLowerCase().includes(kw) ||
          item.deliverableName.toLowerCase().includes(kw) ||
          item.activityName.toLowerCase().includes(kw) ||
          item.taskName.toLowerCase().includes(kw) ||
          String(item.documentsCount).includes(kw)
        );
      }
    }
  }

  clearSearch(): void {
    this.tableSearchKeyword = '';
    this.filterTableData();
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  // Click on task documents count (opens ViewDocsComponent)
  openTaskDocuments(task?: TaskDocumentItem): void {
    this.dialog.open(ViewDocsComponent, {
      width: '750px',
      maxWidth: '95vw',
      maxHeight: '90vh'
    });
  }

  // Click on View icon in gate documents table (directly opens sample PDF)
  viewGateDocument(doc?: GateDocumentItem): void {
    window.open('/sample.pdf', '_blank');
  }

  // Upload Document dialog
  uploaddoc(): void {
    const dialogRef = this.dialog.open(AddDocumentComponent, {
      height: 'auto',
      width: '850px',
      maxWidth: '95vw',
      data: null
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      if (data) {
        if (this.selectedItemType === 'gate' && this.selectedGate) {
          const newGateDoc: GateDocumentItem = {
            id: 'GD-NEW-' + Date.now(),
            gateCode: this.selectedGate.gateCode,
            gateName: this.selectedGate.gateName,
            documentTitle: data.documentTitle || 'New Gate Document',
            uploadedDate: new Date().toISOString().split('T')[0],
            uploadedBy: 'Admin_User'
          };
          this.currentGateDocuments.unshift(newGateDoc);
          this.filterTableData();
        } else {
          const newTask: TaskDocumentItem = {
            id: 'T-NEW-' + Date.now(),
            stageName: this.selectedStage?.stageName || 'Stage',
            deliverableName: this.selectedDeliverable?.name || 'Deliverable',
            activityName: this.selectedActivity?.name || 'General Activity',
            taskName: data.documentTitle || 'New Document Upload Task',
            documentsCount: 1,
            documents: [
              { id: 1, title: data.documentTitle || 'New_Upload.pdf', uploadedDate: new Date().toISOString().split('T')[0] }
            ]
          };
          this.currentActivityTasks.unshift(newTask);
          this.filterTableData();
        }
      }
    });
  }

  scrollRight(): void {
    if (this.scrollContainer?.nativeElement) {
      this.scrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  scrollLeft(): void {
    if (this.scrollContainer?.nativeElement) {
      this.scrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParams: { code: this.projectCode || '2026/FMCG/006', name: this.projectName || 'Vitamin-Enriched Fruit Beverage 250ml' }
    });
  }
}
