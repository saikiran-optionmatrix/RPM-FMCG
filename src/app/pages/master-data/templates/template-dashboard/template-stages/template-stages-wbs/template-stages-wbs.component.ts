import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from '../../../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { AddSimulationComponent } from '../../../../../projects/project-dashboard/project-stages/project-wbs/add-simulation/add-simulation.component';

export interface WbsActivityItem {
  id: number;
  activityName: string;
  jobCode: string;
  department: string;
  responsibility: string;
  priority: 'High' | 'Medium' | 'Low';
  status: boolean;
  requirements?: string;
  tasks?: string;
  delayReason?: string;
  requirementsData?: any[];
  tasksData?: any[];
  planStart?: string;
  planEnd?: string;
  actualStart?: string;
  actualEnd?: string;
  eta?: string;
  planDuration?: string;
  planEffort?: string;
  actualDuration?: string;
  actualEffort?: string;
  dueDate?: string;
  description?: string;
}

export interface WbsDeliverable {
  id: number;
  name: string;
  activities: WbsActivityItem[];
}

@Component({
  selector: 'app-template-stages-wbs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatPaginatorModule
  ],
  templateUrl: './template-stages-wbs.component.html',
  styleUrl: './template-stages-wbs.component.scss'
})
export class TemplateStagesWbsComponent implements OnInit, OnDestroy {
  projectName: string =
    this.route.snapshot.queryParamMap.get('projectName') ||
    this.route.snapshot.queryParamMap.get('name') ||
    this.route.snapshot.queryParamMap.get('templateName') ||
    'New Beverage Product Development Program';
  projectCode: string =
    this.route.snapshot.queryParamMap.get('projectCode') ||
    this.route.snapshot.queryParamMap.get('code') ||
    '2026/FMCG/001';
  stageCode: string = this.route.snapshot.queryParamMap.get('stageCode') || 'S1';
  stageName: string = this.route.snapshot.queryParamMap.get('stageName') || 'Consumer Need and Market Opportunity';

  // Filter properties
  showFilter = false;
  keyword = '';
  status = '';
  searchKeyword = '';
  searchStatus = '';

  // Pagination properties
  pageIndex = 0;
  pageSize = 10;

  readonly delayReasonOptions: string[] = [
    'Consumer concept test inconclusive',
    'Ingredient supplier qualification delay',
    'Packaging barrier / seal integrity failure',
    'Accelerated formulation instability observed',
    'Sensory acceptance gap vs benchmark',
    'Pilot batch filling speed mismatch',
    'Regulatory label claim / artwork rejection'
  ];

  deliverables: WbsDeliverable[] = [
    {
        "id": 1,
        "name": "Consumer opportunity and category landscape",
        "activities": [
            {
                "id": 101,
                "activityName": "Map consumption occasions and unmet consumer jobs",
                "jobCode": "CONS01",
                "department": "Consumer Insights & Strategy",
                "responsibility": "Consumer Insights & Strategy",
                "priority": "High",
                "status": true,
                "requirements": "2/4",
                "tasks": "4/7",
                "delayReason": "",
                "planStart": "2026-01-05",
                "planEnd": "2026-01-26",
                "actualStart": "2026-01-05",
                "actualEnd": "2026-01-25",
                "eta": "2026-01-25",
                "planDuration": "21 days",
                "planEffort": "70 hrs",
                "actualDuration": "21 days",
                "actualEffort": "70 hrs",
                "description": "FMCG consumer work package: Map consumption occasions and unmet consumer jobs. Output: Occasion-by-segment opportunity map with demand evidence.",
                "tasksData": [
                    {
                        "active": true,
                        "done": true,
                        "taskName": "Define sampling and decision questions: map consumption occasions and unmet consumer jobs",
                        "taskCode": "FMCG-T-00001",
                        "jobCode": "CINS-04",
                        "department": "Consumer Insights & Strategy",
                        "role": "Consumer Insights & Strategy Specialist",
                        "dueDate": "2026-06-30",
                        "completedDate": "2026-06-15",
                        "remarks": "Agree the population, recruitment criteria and concept hypotheses. Workstream: Map consumption occasions and unmet consumer jobs. Expected evidence: Occasion-by-segment opportunity map with demand evidence.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": true,
                        "taskName": "Compile category and consumer inputs: map consumption occasions and unmet consumer jobs",
                        "taskCode": "FMCG-T-00002",
                        "jobCode": "CINS-04",
                        "department": "Consumer Insights & Strategy",
                        "role": "Consumer Insights & Strategy Specialist",
                        "dueDate": "2026-06-30",
                        "completedDate": "2026-06-15",
                        "remarks": "Capture market, channel and shopper data with source dates. Workstream: Map consumption occasions and unmet consumer jobs. Expected evidence: Occasion-by-segment opportunity map with demand evidence.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "taskName": "Conduct research and structured fieldwork: map consumption occasions and unmet consumer jobs",
                        "taskCode": "FMCG-T-00003",
                        "jobCode": "CINS-01",
                        "department": "Consumer Insights & Strategy",
                        "role": "Consumer Insights & Strategy Specialist",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Record interviews, surveys or observational results by segment. Workstream: Map consumption occasions and unmet consumer jobs. Expected evidence: Occasion-by-segment opportunity map with demand evidence.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "taskName": "Segment findings and quantify alternatives: map consumption occasions and unmet consumer jobs",
                        "taskCode": "FMCG-T-00004",
                        "jobCode": "CINS-03",
                        "department": "Consumer Insights & Strategy",
                        "role": "Consumer Insights & Strategy Specialist",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Compare relevant needs, price points and product alternatives. Workstream: Map consumption occasions and unmet consumer jobs. Expected evidence: Occasion-by-segment opportunity map with demand evidence.",
                        "isEditing": false
                    }
                ],
                "requirementsData": [
                    {
                        "active": true,
                        "done": true,
                        "requirementName": "Data provenance: Map consumption occasions and unmet consumer jobs",
                        "department": "Consumer opportunity and category landscape",
                        "role": "Quality & Regulatory Compliance Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "2026-06-15",
                        "remarks": "All cited consumer, competitor and channel inputs must have dated source references. Activity-specific acceptance evidence: Occasion-by-segment opportunity map with demand evidence. All decisions must reference the controlled S1 work package.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "requirementName": "Concept response: Map consumption occasions and unmet consumer jobs",
                        "department": "Consumer opportunity and category landscape",
                        "role": "Quality & Regulatory Compliance Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Findings must distinguish observed feedback from inferred demand estimates. Activity-specific acceptance evidence: Occasion-by-segment opportunity map with demand evidence. All decisions must reference the controlled S1 work package.",
                        "isEditing": false
                    }
                ]
            },
            {
                "id": 102,
                "activityName": "Benchmark competitor portfolio and pack-price architecture",
                "jobCode": "CONS01",
                "department": "Consumer Insights & Strategy",
                "responsibility": "Consumer Insights & Strategy",
                "priority": "Medium",
                "status": true,
                "requirements": "4/6",
                "tasks": "4/7",
                "delayReason": "Consumer concept test inconclusive",
                "planStart": "2026-01-05",
                "planEnd": "2026-01-26",
                "actualStart": "2026-01-05",
                "actualEnd": "2026-01-25",
                "eta": "2026-01-25",
                "planDuration": "15 days",
                "planEffort": "85 hrs",
                "actualDuration": "15 days",
                "actualEffort": "85 hrs",
                "description": "FMCG packaging work package: Benchmark competitor portfolio and pack-price architecture. Output: Competitor SKU, unit-price and pack-size benchmark.",
                "tasksData": [
                    {
                        "active": true,
                        "done": true,
                        "taskName": "Define pack design performance needs: benchmark competitor portfolio and pack-price architecture",
                        "taskCode": "FMCG-T-00005",
                        "jobCode": "CINS-04",
                        "department": "Consumer Insights & Strategy",
                        "role": "Consumer Insights & Strategy Specialist",
                        "dueDate": "2026-06-30",
                        "completedDate": "2026-06-15",
                        "remarks": "Specify barrier, use, closure, handling and sustainability targets. Workstream: Benchmark competitor portfolio and pack-price architecture. Expected evidence: Competitor SKU, unit-price and pack-size benchmark.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": true,
                        "taskName": "Run pack compatibility or handling trials: benchmark competitor portfolio and pack-price architecture",
                        "taskCode": "FMCG-T-00006",
                        "jobCode": "CINS-03",
                        "department": "Consumer Insights & Strategy",
                        "role": "Consumer Insights & Strategy Specialist",
                        "dueDate": "2026-06-30",
                        "completedDate": "2026-06-15",
                        "remarks": "Test dispensing, migration/suitability and product interaction as applicable. Workstream: Benchmark competitor portfolio and pack-price architecture. Expected evidence: Competitor SKU, unit-price and pack-size benchmark.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "taskName": "Analyze seal and distribution risks: benchmark competitor portfolio and pack-price architecture",
                        "taskCode": "FMCG-T-00007",
                        "jobCode": "CINS-04",
                        "department": "Consumer Insights & Strategy",
                        "role": "Consumer Insights & Strategy Specialist",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Evaluate defects, stress conditions and consumer-use outcomes. Workstream: Benchmark competitor portfolio and pack-price architecture. Expected evidence: Competitor SKU, unit-price and pack-size benchmark.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "taskName": "Check artwork, print and coding interfaces: benchmark competitor portfolio and pack-price architecture",
                        "taskCode": "FMCG-T-00008",
                        "jobCode": "CINS-02",
                        "department": "Consumer Insights & Strategy",
                        "role": "Consumer Insights & Strategy Specialist",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Confirm legal copy fit, readability and traceability. Workstream: Benchmark competitor portfolio and pack-price architecture. Expected evidence: Competitor SKU, unit-price and pack-size benchmark.",
                        "isEditing": false
                    }
                ],
                "requirementsData": [
                    {
                        "active": true,
                        "done": true,
                        "requirementName": "Pack specification: Benchmark competitor portfolio and pack-price architecture",
                        "department": "Consumer opportunity and category landscape",
                        "role": "Quality & Regulatory Compliance Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "2026-06-15",
                        "remarks": "Pack materials, dimensions and closure parameters must be revision-controlled. Activity-specific acceptance evidence: Competitor SKU, unit-price and pack-size benchmark. All decisions must reference the controlled S1 work package.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "requirementName": "Safety compatibility: Benchmark competitor portfolio and pack-price architecture",
                        "department": "Consumer opportunity and category landscape",
                        "role": "Quality & Regulatory Compliance Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Applicable contact-safety, compatibility and migration evidence must be available. Activity-specific acceptance evidence: Competitor SKU, unit-price and pack-size benchmark. All decisions must reference the controlled S1 work package.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "requirementName": "Traceable pack trials: Benchmark competitor portfolio and pack-price architecture",
                        "department": "Consumer opportunity and category landscape",
                        "role": "Quality & Regulatory Compliance Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Test specimens must identify material batch, print/tool and trial conditions. Activity-specific acceptance evidence: Competitor SKU, unit-price and pack-size benchmark. All decisions must reference the controlled S1 work package.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "requirementName": "Pack release: Benchmark competitor portfolio and pack-price architecture",
                        "department": "Consumer opportunity and category landscape",
                        "role": "Quality & Regulatory Compliance Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Packaging and quality owners must approve the final pack selection. Activity-specific acceptance evidence: Competitor SKU, unit-price and pack-size benchmark. All decisions must reference the controlled S1 work package.",
                        "isEditing": false
                    }
                ]
            },
            {
                "id": 103,
                "activityName": "Estimate addressable category demand and growth pockets",
                "jobCode": "CONS01",
                "department": "Consumer Insights & Strategy",
                "responsibility": "Consumer Insights & Strategy",
                "priority": "Medium",
                "status": true,
                "requirements": "3/5",
                "tasks": "4/7",
                "delayReason": "",
                "planStart": "2026-01-05",
                "planEnd": "2026-01-26",
                "actualStart": "2026-01-05",
                "actualEnd": "2026-01-25",
                "eta": "2026-01-25",
                "planDuration": "21 days",
                "planEffort": "75 hrs",
                "actualDuration": "21 days",
                "actualEffort": "75 hrs",
                "description": "FMCG consumer work package: Estimate addressable category demand and growth pockets. Output: TAM/SAM demand assumptions and scenario ranges.",
                "tasksData": [
                    {
                        "active": true,
                        "done": true,
                        "taskName": "Conduct research and structured fieldwork: estimate addressable category demand and growth pockets",
                        "taskCode": "FMCG-T-00009",
                        "jobCode": "CINS-02",
                        "department": "Consumer Insights & Strategy",
                        "role": "Consumer Insights & Strategy Specialist",
                        "dueDate": "2026-06-30",
                        "completedDate": "2026-06-15",
                        "remarks": "Record interviews, surveys or observational results by segment. Workstream: Estimate addressable category demand and growth pockets. Expected evidence: TAM/SAM demand assumptions and scenario ranges.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": true,
                        "taskName": "Segment findings and quantify alternatives: estimate addressable category demand and growth pockets",
                        "taskCode": "FMCG-T-00010",
                        "jobCode": "CINS-01",
                        "department": "Consumer Insights & Strategy",
                        "role": "Consumer Insights & Strategy Specialist",
                        "dueDate": "2026-06-30",
                        "completedDate": "2026-06-15",
                        "remarks": "Compare relevant needs, price points and product alternatives. Workstream: Estimate addressable category demand and growth pockets. Expected evidence: TAM/SAM demand assumptions and scenario ranges.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "taskName": "Challenge demand assumptions: estimate addressable category demand and growth pockets",
                        "taskCode": "FMCG-T-00011",
                        "jobCode": "CINS-02",
                        "department": "Consumer Insights & Strategy",
                        "role": "Consumer Insights & Strategy Specialist",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Stress-test representativeness and sensitivity to channel mix. Workstream: Estimate addressable category demand and growth pockets. Expected evidence: TAM/SAM demand assumptions and scenario ranges.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "taskName": "Validate insights with commercial leads: estimate addressable category demand and growth pockets",
                        "taskCode": "FMCG-T-00012",
                        "jobCode": "CINS-01",
                        "department": "Consumer Insights & Strategy",
                        "role": "Consumer Insights & Strategy Specialist",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Reconcile interpretation with category and sales stakeholders. Workstream: Estimate addressable category demand and growth pockets. Expected evidence: TAM/SAM demand assumptions and scenario ranges.",
                        "isEditing": false
                    }
                ],
                "requirementsData": [
                    {
                        "active": true,
                        "done": true,
                        "requirementName": "Commercial fit: Estimate addressable category demand and growth pockets",
                        "department": "Consumer opportunity and category landscape",
                        "role": "Quality & Regulatory Compliance Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "2026-06-15",
                        "remarks": "Findings must address realistic channel, price and pack assumptions. Activity-specific acceptance evidence: TAM/SAM demand assumptions and scenario ranges. All decisions must reference the controlled S1 work package.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "requirementName": "Insight traceability: Estimate addressable category demand and growth pockets",
                        "department": "Consumer opportunity and category landscape",
                        "role": "Quality & Regulatory Compliance Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Primary evidence must support the presented consumer opportunity conclusion. Activity-specific acceptance evidence: TAM/SAM demand assumptions and scenario ranges. All decisions must reference the controlled S1 work package.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "requirementName": "Research sign-off: Estimate addressable category demand and growth pockets",
                        "department": "Consumer opportunity and category landscape",
                        "role": "Quality & Regulatory Compliance Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Category and consumer research owners must approve the final insight package. Activity-specific acceptance evidence: TAM/SAM demand assumptions and scenario ranges. All decisions must reference the controlled S1 work package.",
                        "isEditing": false
                    }
                ]
            }
        ]
    },
    {
        "id": 2,
        "name": "Consumer insights and channel discovery",
        "activities": [
            {
                "id": 201,
                "activityName": "Conduct consumer interviews and pain-point coding",
                "jobCode": "CONS01",
                "department": "Consumer Research",
                "responsibility": "Consumer Research",
                "priority": "High",
                "status": true,
                "requirements": "5/7",
                "tasks": "2/5",
                "delayReason": "",
                "planStart": "2026-01-05",
                "planEnd": "2026-01-26",
                "actualStart": "2026-01-05",
                "actualEnd": "2026-01-25",
                "eta": "2026-01-25",
                "planDuration": "19 days",
                "planEffort": "70 hrs",
                "actualDuration": "19 days",
                "actualEffort": "70 hrs",
                "description": "FMCG consumer work package: Conduct consumer interviews and pain-point coding. Output: Structured interview themes and verbatim evidence.",
                "tasksData": [
                    {
                        "active": true,
                        "done": true,
                        "taskName": "Challenge demand assumptions: conduct consumer interviews and pain-point coding",
                        "taskCode": "FMCG-T-00013",
                        "jobCode": "CRE-01",
                        "department": "Consumer Research",
                        "role": "Consumer Research Specialist",
                        "dueDate": "2026-06-30",
                        "completedDate": "2026-06-15",
                        "remarks": "Stress-test representativeness and sensitivity to channel mix. Workstream: Conduct consumer interviews and pain-point coding. Expected evidence: Structured interview themes and verbatim evidence.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": true,
                        "taskName": "Validate insights with commercial leads: conduct consumer interviews and pain-point coding",
                        "taskCode": "FMCG-T-00014",
                        "jobCode": "CRE-03",
                        "department": "Consumer Research",
                        "role": "Consumer Research Specialist",
                        "dueDate": "2026-06-30",
                        "completedDate": "2026-06-15",
                        "remarks": "Reconcile interpretation with category and sales stakeholders. Workstream: Conduct consumer interviews and pain-point coding. Expected evidence: Structured interview themes and verbatim evidence.",
                        "isEditing": false
                    }
                ],
                "requirementsData": [
                    {
                        "active": true,
                        "done": true,
                        "requirementName": "Research sample: Conduct consumer interviews and pain-point coding",
                        "department": "Consumer insights and channel discovery",
                        "role": "Quality & Regulatory Compliance Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "2026-06-15",
                        "remarks": "Research input must identify target consumer groups, sample basis and limitations. Activity-specific acceptance evidence: Structured interview themes and verbatim evidence. All decisions must reference the controlled S1 work package.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "requirementName": "Data provenance: Conduct consumer interviews and pain-point coding",
                        "department": "Consumer insights and channel discovery",
                        "role": "Quality & Regulatory Compliance Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "All cited consumer, competitor and channel inputs must have dated source references. Activity-specific acceptance evidence: Structured interview themes and verbatim evidence. All decisions must reference the controlled S1 work package.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "requirementName": "Concept response: Conduct consumer interviews and pain-point coding",
                        "department": "Consumer insights and channel discovery",
                        "role": "Quality & Regulatory Compliance Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Findings must distinguish observed feedback from inferred demand estimates. Activity-specific acceptance evidence: Structured interview themes and verbatim evidence. All decisions must reference the controlled S1 work package.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "requirementName": "Segment evidence: Conduct consumer interviews and pain-point coding",
                        "department": "Consumer insights and channel discovery",
                        "role": "Quality & Regulatory Compliance Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Target segment and purchase driver differences must be reported with sample counts. Activity-specific acceptance evidence: Structured interview themes and verbatim evidence. All decisions must reference the controlled S1 work package.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "requirementName": "Decision threshold: Conduct consumer interviews and pain-point coding",
                        "department": "Consumer insights and channel discovery",
                        "role": "Quality & Regulatory Compliance Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "A documented acceptance or no-go threshold must precede result interpretation. Activity-specific acceptance evidence: Structured interview themes and verbatim evidence. All decisions must reference the controlled S1 work package.",
                        "isEditing": false
                    }
                ]
            },
            {
                "id": 202,
                "activityName": "Review retail shelf assortment and e-commerce search signals",
                "jobCode": "CONS01",
                "department": "Consumer Research",
                "responsibility": "Consumer Research",
                "priority": "Medium",
                "status": true,
                "requirements": "4/6",
                "tasks": "4/7",
                "delayReason": "Consumer concept test inconclusive",
                "planStart": "2026-01-05",
                "planEnd": "2026-01-26",
                "actualStart": "2026-01-05",
                "actualEnd": "2026-01-25",
                "eta": "2026-01-25",
                "planDuration": "21 days",
                "planEffort": "80 hrs",
                "actualDuration": "21 days",
                "actualEffort": "80 hrs",
                "description": "FMCG commercial work package: Review retail shelf assortment and e-commerce search signals. Output: Store audit and digital-shelf search summary.",
                "tasksData": [
                    {
                        "active": true,
                        "done": true,
                        "taskName": "Build commercial execution inputs: review retail shelf assortment and e-commerce search signals",
                        "taskCode": "FMCG-T-00015",
                        "jobCode": "CRE-04",
                        "department": "Consumer Research",
                        "role": "Consumer Research Specialist",
                        "dueDate": "2026-06-30",
                        "completedDate": "2026-06-15",
                        "remarks": "Prepare price, promotion, listing and distribution assumptions. Workstream: Review retail shelf assortment and e-commerce search signals. Expected evidence: Store audit and digital-shelf search summary.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": true,
                        "taskName": "Coordinate channel or market trials: review retail shelf assortment and e-commerce search signals",
                        "taskCode": "FMCG-T-00016",
                        "jobCode": "CRE-01",
                        "department": "Consumer Research",
                        "role": "Consumer Research Specialist",
                        "dueDate": "2026-06-30",
                        "completedDate": "2026-06-15",
                        "remarks": "Capture representative placement, engagement and sell-through data. Workstream: Review retail shelf assortment and e-commerce search signals. Expected evidence: Store audit and digital-shelf search summary.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "taskName": "Measure execution and consumer response: review retail shelf assortment and e-commerce search signals",
                        "taskCode": "FMCG-T-00017",
                        "jobCode": "CRE-01",
                        "department": "Consumer Research",
                        "role": "Consumer Research Specialist",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Analyze distribution, conversion, feedback and product returns. Workstream: Review retail shelf assortment and e-commerce search signals. Expected evidence: Store audit and digital-shelf search summary.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "taskName": "Reconcile margin and trade economics: review retail shelf assortment and e-commerce search signals",
                        "taskCode": "FMCG-T-00018",
                        "jobCode": "CRE-01",
                        "department": "Consumer Research",
                        "role": "Consumer Research Specialist",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Validate spending, landed cost and sales assumptions. Workstream: Review retail shelf assortment and e-commerce search signals. Expected evidence: Store audit and digital-shelf search summary.",
                        "isEditing": false
                    }
                ],
                "requirementsData": [
                    {
                        "active": true,
                        "done": true,
                        "requirementName": "Measurable objectives: Review retail shelf assortment and e-commerce search signals",
                        "department": "Consumer insights and channel discovery",
                        "role": "Quality & Regulatory Compliance Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "2026-06-15",
                        "remarks": "Objectives must state baseline, target, measurement period and accountable owner. Activity-specific acceptance evidence: Store audit and digital-shelf search summary. All decisions must reference the controlled S1 work package.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "requirementName": "Channel coverage: Review retail shelf assortment and e-commerce search signals",
                        "department": "Consumer insights and channel discovery",
                        "role": "Quality & Regulatory Compliance Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Distribution and retail assumptions must specify relevant channel or outlet types. Activity-specific acceptance evidence: Store audit and digital-shelf search summary. All decisions must reference the controlled S1 work package.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "requirementName": "Commercial validation: Review retail shelf assortment and e-commerce search signals",
                        "department": "Consumer insights and channel discovery",
                        "role": "Quality & Regulatory Compliance Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Margin and COGS calculations must use current approved SKU assumptions. Activity-specific acceptance evidence: Store audit and digital-shelf search summary. All decisions must reference the controlled S1 work package.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "requirementName": "Launch authorization: Review retail shelf assortment and e-commerce search signals",
                        "department": "Consumer insights and channel discovery",
                        "role": "Quality & Regulatory Compliance Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Commercial release conditions and unresolved risks must be approved. Activity-specific acceptance evidence: Store audit and digital-shelf search summary. All decisions must reference the controlled S1 work package.",
                        "isEditing": false
                    }
                ]
            },
            {
                "id": 203,
                "activityName": "Identify shopper decision drivers and purchase barriers",
                "jobCode": "CONS01",
                "department": "Consumer Research",
                "responsibility": "Consumer Research",
                "priority": "Medium",
                "status": true,
                "requirements": "7/9",
                "tasks": "5/8",
                "delayReason": "",
                "planStart": "2026-01-05",
                "planEnd": "2026-01-26",
                "actualStart": "2026-01-05",
                "actualEnd": "2026-01-25",
                "eta": "2026-01-25",
                "planDuration": "15 days",
                "planEffort": "110 hrs",
                "actualDuration": "15 days",
                "actualEffort": "110 hrs",
                "description": "FMCG commercial work package: Identify shopper decision drivers and purchase barriers. Output: Ranked drivers including taste, efficacy, convenience, and value.",
                "tasksData": [
                    {
                        "active": true,
                        "done": true,
                        "taskName": "Set channel and launch objectives: identify shopper decision drivers and purchase barriers",
                        "taskCode": "FMCG-T-00019",
                        "jobCode": "CRE-01",
                        "department": "Consumer Research",
                        "role": "Consumer Research Specialist",
                        "dueDate": "2026-06-30",
                        "completedDate": "2026-06-15",
                        "remarks": "Define outlets, shopper proposition, measures and owners. Workstream: Identify shopper decision drivers and purchase barriers. Expected evidence: Ranked drivers including taste, efficacy, convenience, and value.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": true,
                        "taskName": "Build commercial execution inputs: identify shopper decision drivers and purchase barriers",
                        "taskCode": "FMCG-T-00020",
                        "jobCode": "CRE-03",
                        "department": "Consumer Research",
                        "role": "Consumer Research Specialist",
                        "dueDate": "2026-06-30",
                        "completedDate": "2026-06-15",
                        "remarks": "Prepare price, promotion, listing and distribution assumptions. Workstream: Identify shopper decision drivers and purchase barriers. Expected evidence: Ranked drivers including taste, efficacy, convenience, and value.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "taskName": "Coordinate channel or market trials: identify shopper decision drivers and purchase barriers",
                        "taskCode": "FMCG-T-00021",
                        "jobCode": "CRE-03",
                        "department": "Consumer Research",
                        "role": "Consumer Research Specialist",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Capture representative placement, engagement and sell-through data. Workstream: Identify shopper decision drivers and purchase barriers. Expected evidence: Ranked drivers including taste, efficacy, convenience, and value.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "taskName": "Measure execution and consumer response: identify shopper decision drivers and purchase barriers",
                        "taskCode": "FMCG-T-00022",
                        "jobCode": "CRE-03",
                        "department": "Consumer Research",
                        "role": "Consumer Research Specialist",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Analyze distribution, conversion, feedback and product returns. Workstream: Identify shopper decision drivers and purchase barriers. Expected evidence: Ranked drivers including taste, efficacy, convenience, and value.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "taskName": "Address launch-readiness gaps: identify shopper decision drivers and purchase barriers",
                        "taskCode": "FMCG-T-00023",
                        "jobCode": "CRE-04",
                        "department": "Consumer Research",
                        "role": "Consumer Research Specialist",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Close retailer, asset, inventory or activation dependencies. Workstream: Identify shopper decision drivers and purchase barriers. Expected evidence: Ranked drivers including taste, efficacy, convenience, and value.",
                        "isEditing": false
                    }
                ],
                "requirementsData": [
                    {
                        "active": true,
                        "done": true,
                        "requirementName": "Measurable objectives: Identify shopper decision drivers and purchase barriers",
                        "department": "Consumer insights and channel discovery",
                        "role": "Quality & Regulatory Compliance Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "2026-06-15",
                        "remarks": "Objectives must state baseline, target, measurement period and accountable owner. Activity-specific acceptance evidence: Ranked drivers including taste, efficacy, convenience, and value. All decisions must reference the controlled S1 work package.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "requirementName": "Channel coverage: Identify shopper decision drivers and purchase barriers",
                        "department": "Consumer insights and channel discovery",
                        "role": "Quality & Regulatory Compliance Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Distribution and retail assumptions must specify relevant channel or outlet types. Activity-specific acceptance evidence: Ranked drivers including taste, efficacy, convenience, and value. All decisions must reference the controlled S1 work package.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "requirementName": "Consumer evidence: Identify shopper decision drivers and purchase barriers",
                        "department": "Consumer insights and channel discovery",
                        "role": "Quality & Regulatory Compliance Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Market response conclusions must distinguish measured and projected sales. Activity-specific acceptance evidence: Ranked drivers including taste, efficacy, convenience, and value. All decisions must reference the controlled S1 work package.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "requirementName": "Spend governance: Identify shopper decision drivers and purchase barriers",
                        "department": "Consumer insights and channel discovery",
                        "role": "Quality & Regulatory Compliance Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Trade, launch and media assumptions must fit the approved funding envelope. Activity-specific acceptance evidence: Ranked drivers including taste, efficacy, convenience, and value. All decisions must reference the controlled S1 work package.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "requirementName": "Feedback escalation: Identify shopper decision drivers and purchase barriers",
                        "department": "Consumer insights and channel discovery",
                        "role": "Quality & Regulatory Compliance Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Consumer complaints and early market-quality signals must have escalation routes. Activity-specific acceptance evidence: Ranked drivers including taste, efficacy, convenience, and value. All decisions must reference the controlled S1 work package.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "requirementName": "Commercial validation: Identify shopper decision drivers and purchase barriers",
                        "department": "Consumer insights and channel discovery",
                        "role": "Quality & Regulatory Compliance Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Margin and COGS calculations must use current approved SKU assumptions. Activity-specific acceptance evidence: Ranked drivers including taste, efficacy, convenience, and value. All decisions must reference the controlled S1 work package.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "requirementName": "Launch authorization: Identify shopper decision drivers and purchase barriers",
                        "department": "Consumer insights and channel discovery",
                        "role": "Quality & Regulatory Compliance Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Commercial release conditions and unresolved risks must be approved. Activity-specific acceptance evidence: Ranked drivers including taste, efficacy, convenience, and value. All decisions must reference the controlled S1 work package.",
                        "isEditing": false
                    }
                ]
            }
        ]
    },
    {
        "id": 3,
        "name": "Opportunity case and strategic alignment",
        "activities": [
            {
                "id": 301,
                "activityName": "Draft product opportunity hypothesis and positioning territory",
                "jobCode": "CATE01",
                "department": "Category Management",
                "responsibility": "Category Management",
                "priority": "High",
                "status": true,
                "requirements": "2/4",
                "tasks": "2/5",
                "delayReason": "",
                "planStart": "2026-01-05",
                "planEnd": "2026-01-26",
                "actualStart": "2026-01-05",
                "actualEnd": "2026-01-25",
                "eta": "2026-01-25",
                "planDuration": "18 days",
                "planEffort": "55 hrs",
                "actualDuration": "18 days",
                "actualEffort": "55 hrs",
                "description": "FMCG governance work package: Draft product opportunity hypothesis and positioning territory. Output: Positioning hypothesis linked to target consumers.",
                "tasksData": [
                    {
                        "active": true,
                        "done": true,
                        "taskName": "Compare alternatives and critical risks: draft product opportunity hypothesis and positioning territory",
                        "taskCode": "FMCG-T-00024",
                        "jobCode": "CAT-02",
                        "department": "Category Management",
                        "role": "Category Management Specialist",
                        "dueDate": "2026-06-30",
                        "completedDate": "2026-06-15",
                        "remarks": "Review option trade-offs, exposure and cost impacts. Workstream: Draft product opportunity hypothesis and positioning territory. Expected evidence: Positioning hypothesis linked to target consumers.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": true,
                        "taskName": "Build consolidated decision record: draft product opportunity hypothesis and positioning territory",
                        "taskCode": "FMCG-T-00025",
                        "jobCode": "CAT-01",
                        "department": "Category Management",
                        "role": "Category Management Specialist",
                        "dueDate": "2026-06-30",
                        "completedDate": "2026-06-15",
                        "remarks": "Document proposal, assumptions and issues with owners. Workstream: Draft product opportunity hypothesis and positioning territory. Expected evidence: Positioning hypothesis linked to target consumers.",
                        "isEditing": false
                    }
                ],
                "requirementsData": [
                    {
                        "active": true,
                        "done": true,
                        "requirementName": "Defined decision: Draft product opportunity hypothesis and positioning territory",
                        "department": "Opportunity case and strategic alignment",
                        "role": "Quality & Regulatory Compliance Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "2026-06-15",
                        "remarks": "Approval scope, authority and decision criteria must be documented. Activity-specific acceptance evidence: Positioning hypothesis linked to target consumers. All decisions must reference the controlled S1 work package.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "requirementName": "Cross-functional evidence: Draft product opportunity hypothesis and positioning territory",
                        "department": "Opportunity case and strategic alignment",
                        "role": "Quality & Regulatory Compliance Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Affected departments must supply identifiable evidence and sign-off. Activity-specific acceptance evidence: Positioning hypothesis linked to target consumers. All decisions must reference the controlled S1 work package.",
                        "isEditing": false
                    }
                ]
            },
            {
                "id": 302,
                "activityName": "Build initial margin, price and risk screen",
                "jobCode": "CATE01",
                "department": "Category Management",
                "responsibility": "Category Management",
                "priority": "Medium",
                "status": true,
                "requirements": "5/7",
                "tasks": "5/8",
                "delayReason": "Consumer concept test inconclusive",
                "planStart": "2026-01-05",
                "planEnd": "2026-01-26",
                "actualStart": "2026-01-05",
                "actualEnd": "2026-01-25",
                "eta": "2026-01-25",
                "planDuration": "19 days",
                "planEffort": "105 hrs",
                "actualDuration": "19 days",
                "actualEffort": "105 hrs",
                "description": "FMCG consumer work package: Build initial margin, price and risk screen. Output: Price ladder, preliminary gross-margin bridge and risk log.",
                "tasksData": [
                    {
                        "active": true,
                        "done": true,
                        "taskName": "Define sampling and decision questions: build initial margin, price and risk screen",
                        "taskCode": "FMCG-T-00026",
                        "jobCode": "CAT-03",
                        "department": "Category Management",
                        "role": "Category Management Specialist",
                        "dueDate": "2026-06-30",
                        "completedDate": "2026-06-15",
                        "remarks": "Agree the population, recruitment criteria and concept hypotheses. Workstream: Build initial margin, price and risk screen. Expected evidence: Price ladder, preliminary gross-margin bridge and risk log.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": true,
                        "taskName": "Compile category and consumer inputs: build initial margin, price and risk screen",
                        "taskCode": "FMCG-T-00027",
                        "jobCode": "CAT-02",
                        "department": "Category Management",
                        "role": "Category Management Specialist",
                        "dueDate": "2026-06-30",
                        "completedDate": "2026-06-15",
                        "remarks": "Capture market, channel and shopper data with source dates. Workstream: Build initial margin, price and risk screen. Expected evidence: Price ladder, preliminary gross-margin bridge and risk log.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "taskName": "Conduct research and structured fieldwork: build initial margin, price and risk screen",
                        "taskCode": "FMCG-T-00028",
                        "jobCode": "CAT-04",
                        "department": "Category Management",
                        "role": "Category Management Specialist",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Record interviews, surveys or observational results by segment. Workstream: Build initial margin, price and risk screen. Expected evidence: Price ladder, preliminary gross-margin bridge and risk log.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "taskName": "Segment findings and quantify alternatives: build initial margin, price and risk screen",
                        "taskCode": "FMCG-T-00029",
                        "jobCode": "CAT-01",
                        "department": "Category Management",
                        "role": "Category Management Specialist",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Compare relevant needs, price points and product alternatives. Workstream: Build initial margin, price and risk screen. Expected evidence: Price ladder, preliminary gross-margin bridge and risk log.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "taskName": "Validate insights with commercial leads: build initial margin, price and risk screen",
                        "taskCode": "FMCG-T-00030",
                        "jobCode": "CAT-03",
                        "department": "Category Management",
                        "role": "Category Management Specialist",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Reconcile interpretation with category and sales stakeholders. Workstream: Build initial margin, price and risk screen. Expected evidence: Price ladder, preliminary gross-margin bridge and risk log.",
                        "isEditing": false
                    }
                ],
                "requirementsData": [
                    {
                        "active": true,
                        "done": true,
                        "requirementName": "Concept response: Build initial margin, price and risk screen",
                        "department": "Opportunity case and strategic alignment",
                        "role": "Quality & Regulatory Compliance Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "2026-06-15",
                        "remarks": "Findings must distinguish observed feedback from inferred demand estimates. Activity-specific acceptance evidence: Price ladder, preliminary gross-margin bridge and risk log. All decisions must reference the controlled S1 work package.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "requirementName": "Segment evidence: Build initial margin, price and risk screen",
                        "department": "Opportunity case and strategic alignment",
                        "role": "Quality & Regulatory Compliance Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Target segment and purchase driver differences must be reported with sample counts. Activity-specific acceptance evidence: Price ladder, preliminary gross-margin bridge and risk log. All decisions must reference the controlled S1 work package.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "requirementName": "Decision threshold: Build initial margin, price and risk screen",
                        "department": "Opportunity case and strategic alignment",
                        "role": "Quality & Regulatory Compliance Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "A documented acceptance or no-go threshold must precede result interpretation. Activity-specific acceptance evidence: Price ladder, preliminary gross-margin bridge and risk log. All decisions must reference the controlled S1 work package.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "requirementName": "Commercial fit: Build initial margin, price and risk screen",
                        "department": "Opportunity case and strategic alignment",
                        "role": "Quality & Regulatory Compliance Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Findings must address realistic channel, price and pack assumptions. Activity-specific acceptance evidence: Price ladder, preliminary gross-margin bridge and risk log. All decisions must reference the controlled S1 work package.",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "requirementName": "Insight traceability: Build initial margin, price and risk screen",
                        "department": "Opportunity case and strategic alignment",
                        "role": "Quality & Regulatory Compliance Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "",
                        "remarks": "Primary evidence must support the presented consumer opportunity conclusion. Activity-specific acceptance evidence: Price ladder, preliminary gross-margin bridge and risk log. All decisions must reference the controlled S1 work package.",
                        "isEditing": false
                    }
                ]
            },
            {
                "id": 303,
                "activityName": "Competitive pricing, trade margin structure and route-to-market analysis",
                "jobCode": "CINS01",
                "department": "Category Management & Commercialization",
                "responsibility": "Category Management & Commercialization",
                "priority": "Medium",
                "status": true,
                "requirements": "3/5",
                "tasks": "4/7",
                "delayReason": "",
                "planStart": "2026-01-05",
                "planEnd": "2026-01-26",
                "actualStart": "2026-01-05",
                "actualEnd": "2026-01-25",
                "eta": "2026-01-25",
                "planDuration": "15 days",
                "planEffort": "65 hrs",
                "actualDuration": "15 days",
                "actualEffort": "65 hrs",
                "description": "Model distributor margins, modern trade rebate tiers, and retail price elasticity across target markets.",
                "tasksData": [
                    {
                        "active": true,
                        "done": true,
                        "taskName": "Compile GT and MT channel distributor margin benchmarks",
                        "taskCode": "FMCG-T-00031",
                        "jobCode": "CINS-04",
                        "department": "Category Management",
                        "role": "Commercial Strategy Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "2026-06-15",
                        "remarks": "Direct store delivery and wholesaler terms audited",
                        "isEditing": false
                    },
                    {
                        "active": true,
                        "done": false,
                        "taskName": "Validate retailer price points against consumer willingness-to-pay",
                        "taskCode": "FMCG-T-00032",
                        "jobCode": "CINS-04",
                        "department": "Consumer Insights",
                        "role": "Consumer Research Lead",
                        "dueDate": "2026-07-15",
                        "completedDate": "",
                        "remarks": "Conjoint price laddering analysis executed",
                        "isEditing": false
                    }
                ],
                "requirementsData": [
                    {
                        "active": true,
                        "done": true,
                        "requirementName": "Channel margin feasibility: GT minimum 18% and MT 25% gross margin headroom",
                        "department": "Finance & Commercialization",
                        "role": "Commercial Finance Manager",
                        "dueDate": "2026-06-30",
                        "completedDate": "2026-06-15",
                        "remarks": "Meets internal hurdle rate for consumer beverage portfolio",
                        "isEditing": false
                    }
                ]
            },
            {
                "id": 304,
                "activityName": "Brand positioning, occasion-fit and pack-size architecture validation",
                "jobCode": "BRND01",
                "department": "Brand Marketing & Innovation",
                "responsibility": "Brand Marketing & Innovation",
                "priority": "Medium",
                "status": true,
                "requirements": "3/5",
                "tasks": "3/6",
                "delayReason": "",
                "planStart": "2026-01-05",
                "planEnd": "2026-01-26",
                "actualStart": "2026-01-05",
                "actualEnd": "2026-01-25",
                "eta": "2026-01-25",
                "planDuration": "14 days",
                "planEffort": "60 hrs",
                "actualDuration": "14 days",
                "actualEffort": "60 hrs",
                "description": "Finalize core brand equity proposition, on-the-go single-serve vs multi-pack format portfolio strategy.",
                "tasksData": [
                    {
                        "active": true,
                        "done": true,
                        "taskName": "Evaluate 250ml single-serve vs 1L family-pack occasion dynamics",
                        "taskCode": "FMCG-T-00033",
                        "jobCode": "BRND-02",
                        "department": "Brand Marketing",
                        "role": "Brand Manager",
                        "dueDate": "2026-06-30",
                        "completedDate": "2026-06-15",
                        "remarks": "250ml verified as lead SKU for impulse and modern trade channels",
                        "isEditing": false
                    }
                ],
                "requirementsData": [
                    {
                        "active": true,
                        "done": true,
                        "requirementName": "Occasion fit evidence: minimum 70% consumer appeal in target demographic",
                        "department": "Consumer Insights",
                        "role": "Consumer Insights Lead",
                        "dueDate": "2026-06-30",
                        "completedDate": "2026-06-15",
                        "remarks": "Quantitative concept screening verified",
                        "isEditing": false
                    }
                ]
            }
        ]
    }
];

  selectedDeliverable: WbsDeliverable = this.deliverables[0];

  // Timeline Modal Popup state
  showTimelineModal = false;
  selectedTimelineItem: any = null;

  // Add / Edit Activity Modal state
  showActivityModal = false;
  isEditActivityMode = false;
  activityModalData: Partial<WbsActivityItem> = {};
  activityModalIndex = -1;

  private routeSub?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly location: Location
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name'] || params['templateName']) {
        this.projectName = params['projectName'] || params['name'] || params['templateName'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      if (params['stageName']) {
        this.stageName = params['stageName'];
      }
      if (params['stageCode']) {
        this.stageCode = params['stageCode'];
      }
    });

    if (this.deliverables.length > 0) {
      this.selectedDeliverable = this.deliverables[0];
    }
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  get filteredActivities(): WbsActivityItem[] {
    if (!this.selectedDeliverable || !this.selectedDeliverable.activities) {
      return [];
    }
    return this.selectedDeliverable.activities.filter(item => {
      const keywordMatches =
        !this.searchKeyword ||
        item.activityName.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        item.jobCode.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        item.department.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        item.responsibility.toLowerCase().includes(this.searchKeyword.toLowerCase());

      const itemStatusStr = item.status ? 'Active' : 'Inactive';
      const statusMatches = !this.searchStatus || itemStatusStr === this.searchStatus;

      return keywordMatches && statusMatches;
    });
  }

  get paginatedActivities(): WbsActivityItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredActivities.slice(startIndex, startIndex + this.pageSize);
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  onSearch(): void {
    this.searchKeyword = this.keyword.trim();
    this.searchStatus = this.status;
    this.pageIndex = 0;
  }

  onClear(): void {
    this.keyword = '';
    this.status = '';
    this.searchKeyword = '';
    this.searchStatus = '';
    this.pageIndex = 0;
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  selectDeliverable(d: WbsDeliverable): void {
    this.selectedDeliverable = d;
    this.pageIndex = 0;
  }

  deleteDeliverable(d: WbsDeliverable, event: Event): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: { title: 'Delete Deliverable', content: `Are you sure you want to delete "${d.name}"?` }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deliverables = this.deliverables.filter(item => item.id !== d.id);
        if (this.selectedDeliverable?.id === d.id) {
          this.selectedDeliverable = this.deliverables[0] || null;
          this.pageIndex = 0;
        }
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  goToSchedule(): void {
    this.location.back();
  }

  toggleStatus(item: WbsActivityItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: { title: 'Change Status', content: 'Are you sure you want to change the status of this activity?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        item.status = !item.status;
      }
    });
  }

  deleteActivity(item: WbsActivityItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: { title: 'Delete Activity', content: 'Are you sure you want to delete this activity?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && this.selectedDeliverable) {
        this.selectedDeliverable.activities = this.selectedDeliverable.activities.filter(a => a.id !== item.id);
      }
    });
  }

  openAddActivity(): void {
    this.isEditActivityMode = false;
    const nextNum = (this.selectedDeliverable?.activities?.length || 0) + 1;
    this.activityModalData = {
      jobCode: 'ACT' + nextNum,
      activityName: '',
      department: 'Management',
      responsibility: '',
      priority: 'Medium',
      status: true,
      requirements: '0/13',
      tasks: '0/16',
      planStart: '',
      planEnd: '',
      planDuration: '',
      planEffort: '',
      description: ''
    };
    this.showActivityModal = true;
  }

  openEditActivity(item: WbsActivityItem, index: number): void {
    this.isEditActivityMode = true;
    this.activityModalIndex = index;
    this.activityModalData = { ...item };
    this.showActivityModal = true;
  }

  saveActivity(): void {
    if (!this.activityModalData.activityName || !this.selectedDeliverable) return;

    if (this.isEditActivityMode && this.activityModalIndex > -1) {
      this.selectedDeliverable.activities[this.activityModalIndex] = {
        ...this.selectedDeliverable.activities[this.activityModalIndex],
        ...this.activityModalData
      } as WbsActivityItem;
    } else {
      const newAct: WbsActivityItem = {
        id: Date.now(),
        activityName: this.activityModalData.activityName || '',
        jobCode: this.activityModalData.jobCode || 'ACT' + (this.selectedDeliverable.activities.length + 1),
        department: this.activityModalData.department || 'Management',
        responsibility: this.activityModalData.responsibility || 'Unassigned',
        priority: this.activityModalData.priority || 'Medium',
        status: true,
        requirements: this.activityModalData.requirements || '0/13',
        tasks: this.activityModalData.tasks || '0/16',
        planStart: this.activityModalData.planStart,
        planEnd: this.activityModalData.planEnd,
        planDuration: this.activityModalData.planDuration,
        planEffort: this.activityModalData.planEffort,
        description: this.activityModalData.description
      };
      this.selectedDeliverable.activities.push(newAct);
    }
    this.closeActivityModal();
  }

  closeActivityModal(): void {
    this.showActivityModal = false;
    this.activityModalData = {};
    this.activityModalIndex = -1;
  }

  openTimelineModal(item: WbsActivityItem): void {
    this.selectedTimelineItem = item;
    this.showTimelineModal = true;
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineItem = null;
  }

  openAddSimulation(): void {
    const dialogRef = this.dialog.open(AddSimulationComponent, {
      width: '550px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Simulation data saved:', result);
      }
    });
  }

  assignrequirement(item?: WbsActivityItem): void {
    this.router.navigate(['requirements'], {
      relativeTo: this.route,
      queryParams: {
        activityName: item?.activityName,
        jobCode: item?.jobCode,
        department: item?.department,
        stageName: this.stageName,
        stageCode: this.stageCode,
        projectName: this.projectName,
        projectCode: this.projectCode,
        requirements: item?.requirements
      },
      queryParamsHandling: 'merge'
    });
  }

  assigntasks(item?: WbsActivityItem): void {
    this.router.navigate(['tasks'], {
      relativeTo: this.route,
      queryParams: {
        activityName: item?.activityName,
        jobCode: item?.jobCode,
        department: item?.department,
        stageName: this.stageName,
        stageCode: this.stageCode,
        projectName: this.projectName,
        projectCode: this.projectCode,
        tasks: item?.tasks
      },
      queryParamsHandling: 'merge'
    });
  }
}
