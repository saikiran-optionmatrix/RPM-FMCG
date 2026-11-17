import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface PredecessorItem {
  id?: string | number;
  stage: string;
  deliverable?: string;
  activity: string;
  type?: string;
}

@Component({
  selector: 'app-stages-predecessor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './stages-predecessor.component.html',
  styleUrl: './stages-predecessor.component.scss',
})
export class StagesPredecessorComponent implements OnInit {
  pageIndex = 0;
  pageSize = 5;

  taskName: string = '';
  taskSlNo: string = '';

  readonly typeOptions: string[] = [
    'FS - Finish to Start - Finish A to Start B',
    'SF - Start to Finish - B must be started to finish A',
    'SS - Start to Start - A must start before B is started',
    'FF - Finish to Finish - B can be finished only after A is finished'
  ];

  stageOptions: string[] = [
  "S1 - Consumer Need & Market Opportunity",
  "S2 - Market & Product Concept Validation",
  "S3 - Product Ideation & Concept Screening",
  "S4 - Product Formulation & Optimization",
  "S5 - Product Concept & Formula Selection",
  "S6 - Formulation & Manufacturing Process Development",
  "S7 - Prototype Testing & Product Safety Assessment",
  "S8 - Product Compliance Documentation & Label Filing",
  "S9 - Concept & Feasibility Validation",
  "S10 - Pilot Production & Market Testing",
  "S11 - Commercial Scale-Up & Launch Preparation",
  "S12 - Regulatory Compliance Release & Commercial Product Launch"
];

  stageDeliverablesMap: { [key: string]: string[] } = {
  "S1 - Consumer Need & Market Opportunity": [
    "1.1 - Consumer opportunity and category landscape",
    "1.2 - Consumer insights and channel discovery",
    "1.3 - Opportunity case and strategic alignment"
  ],
  "S2 - Market & Product Concept Validation": [
    "2.1 - Concept demand and target-product definition",
    "2.2 - Technical and supply feasibility screening",
    "2.3 - Commercial case and concept research",
    "Gate 1 - Gate 1: Product Concept Selection Checkpoints"
  ],
  "S3 - Product Ideation & Concept Screening": [
    "3.1 - Idea generation and portfolio exploration",
    "3.2 - Supplier and technology concept screening",
    "3.3 - Concept ranking and early risk reduction"
  ],
  "S4 - Product Formulation & Optimization": [
    "4.1 - Bench formulation and prototype creation",
    "4.2 - Sensory, functional and physicochemical optimization",
    "4.3 - Bench analytical and safety evaluation",
    "4.4 - Experimental design and formula optimization"
  ],
  "S5 - Product Concept & Formula Selection": [
    "5.1 - Formula option selection and lock",
    "5.2 - Packaging concept and consumer fit selection",
    "5.3 - Design gate and development handover",
    "Gate 2 - Gate 2: Product Concept & Formula Selection Checkpoints"
  ],
  "S6 - Formulation & Manufacturing Process Development": [
    "6.1 - Manufacturing process and scale-up design",
    "6.2 - Equipment, packaging and cleaning integration",
    "6.3 - Quality control plan and process capability",
    "6.4 - Pilot readiness and manufacturing cost"
  ],
  "S7 - Prototype Testing & Product Safety Assessment": [
    "7.1 - Prototype verification and product safety",
    "7.2 - Sensory performance and consumer handling",
    "7.3 - Shelf-life pilot studies and product risk closure",
    "Gate 3 - Gate 3: Product Concept & Feasibility Approval Checkpoints"
  ],
  "S8 - Product Compliance Documentation & Label Filing": [
    "8.1 - Compliance documentation and label development",
    "8.2 - Claims and pack artwork review",
    "8.3 - Compliance release planning"
  ],
  "S9 - Concept & Feasibility Validation": [
    "9.1 - Feasibility validation against target attributes",
    "9.2 - Operational and supply feasibility",
    "9.3 - Consumer proposition and claim feasibility",
    "9.4 - Feasibility decision and gap closure"
  ],
  "S10 - Pilot Production & Market Testing": [
    "10.1 - Pilot manufacturing builds and yield stabilization",
    "10.2 - Pilot quality assurance and shelf-life monitoring",
    "10.3 - In-market or controlled market evaluation",
    "10.4 - Pilot exit and commercial readiness recommendation",
    "Gate 4 - Gate 4: Consumer Validation & Product Performance Proof Checkpoints"
  ],
  "S11 - Commercial Scale-Up & Launch Preparation": [
    "11.1 - Industrial scale-up and site qualification",
    "11.2 - Supply availability and operational resilience",
    "11.3 - Commercial quality system and launch controls",
    "11.4 - Go-to-market and trade launch preparation",
    "Gate 5 - Gate 5: Market Launch & Regulatory Compliance Readiness Checkpoints"
  ],
  "S12 - Regulatory Compliance Release & Commercial Product Launch": [
    "12.1 - Final market authorization and production release",
    "12.2 - Commercial launch execution and performance",
    "12.3 - Post-launch quality and business stabilization"
  ]
};

  stageActivitiesMap: { [key: string]: string[] } = {
    "1.1 - Market opportunity and customer requirements baseline": [
        "1.1.1 - Review industrial application demand, customer specifications and market opportunities",
        "1.1.2 - Benchmark competing chemical grades, suppliers and production technologies"
    ],
    "1.2 - Product concept and preliminary business case": [
        "1.2.1 - Define target product profile, purity, concentration and performance attributes",
        "1.2.2 - Prepare preliminary business case, project economics and opportunity assessment"
    ],
    "2.1 - Product and process feasibility assessment": [
        "2.1.1 - Screen reaction chemistry, formulation options and product feasibility",
        "2.1.2 - Assess raw material availability, critical reagent supply and vendor capability"
    ],
    "2.2 - Project charter, EHS and regulatory feasibility package": [
        "2.2.1 - Conduct preliminary process hazard, environmental and regulatory screening",
        "2.2.2 - Prepare feasibility report, target specifications and Gate 1 submission"
    ],
    "Gate 1 - Gate 1: Concept Approval Checkpoints": [
        "Gate1.1 - Market Demand & Competitive Benchmark Assessment",
        "Gate1.2 - Chemistry & Process Feasibility Assessment",
        "Gate1.3 - Preliminary Business Case & Cost of Manufacturing Model",
        "Gate1.4 - Patents & Freedom-to-Operate (FTO) Clearance",
        "Gate1.5 - Process Safety, Technology & Scale-Up Risk Assessment",
        "Gate1.6 - Regulatory Pathway & Registration Strategy Outline",
        "Gate1.7 - Executive Committee Concept Approval Release"
    ],
    "3.1 - Candidate chemistry routes and laboratory synthesis results": [
        "3.1.1 - Develop candidate synthesis routes and reaction pathway hypotheses",
        "3.1.2 - Conduct laboratory-scale reaction and catalyst screening experiments"
    ],
    "3.2 - Intermediate characterization and route scouting report": [
        "3.2.1 - Characterize intermediates, impurities and product composition using GC/HPLC and spectroscopy",
        "3.2.2 - Document route scouting results, material balance and preliminary yield assessment"
    ],
    "4.1 - Optimized laboratory process and operating window": [
        "4.1.1 - Optimize reaction parameters, catalyst loading, temperature, pressure and residence time",
        "4.1.2 - Evaluate solvent systems, separation methods and purification sequence"
    ],
    "4.2 - Analytical control strategy and process robustness evidence": [
        "4.2.1 - Assess process yield, selectivity, impurity profile and batch-to-batch reproducibility",
        "4.2.2 - Develop analytical methods and establish in-process control limits"
    ],
    "5.1 - Selected process route and approved basis of design": [
        "5.1.1 - Compare candidate process routes against safety, quality, cost and sustainability criteria",
        "5.1.2 - Prepare process flow diagrams, mass and energy balances and equipment sizing basis"
    ],
    "5.2 - Engineering design basis and scale-up risk assessment": [
        "5.2.1 - Define critical process parameters, control strategy and operating envelope",
        "5.2.2 - Complete basis of design, scale-up risk review and Gate 2 recommendation"
    ],
    "Gate 2 - Gate 2: Process Route Selection Checkpoints": [
        "Gate2.1 - Yield & Selectivity Profile",
        "Gate2.2 - Process Robustness Proof",
        "Gate2.3 - Impurity & Waste Assessment",
        "Gate2.4 - Preliminary Safety Screening",
        "Gate2.5 - Basis of Design & Cost of Manufacturing Estimate",
        "Gate2.6 - Route Selection Committee Release"
    ],
    "6.1 - Bench-to-pilot process development package": [
        "6.1.1 - Translate laboratory process parameters into bench and pilot scale operating procedures",
        "6.1.2 - Execute bench-scale batches and assess yield, quality and process consistency"
    ],
    "6.2 - Pilot equipment, materials and scale-up readiness": [
        "6.2.1 - Develop downstream separation, solvent recovery and waste treatment operations",
        "6.2.2 - Qualify raw materials, utilities, equipment and measurement systems for pilot readiness"
    ],
    "7.1 - Process safety and risk assessment dossier": [
        "7.1.1 - Complete process hazard analysis (HAZOP), risk assessment and safeguards review",
        "7.1.2 - Assess occupational exposure, chemical compatibility, fire and explosion protection"
    ],
    "7.2 - Regulatory, environmental and pilot readiness evidence": [
        "7.2.1 - Develop environmental impact, effluent, emissions and hazardous waste management plans",
        "7.2.2 - Compile regulatory data package, safety studies and Gate 3 readiness evidence"
    ],
    "Gate 3 - Gate 3: Registration & Pilot Readiness Checkpoints": [
        "Gate3.1 - Process Hazard Analysis Package",
        "Gate3.2 - Pilot Plant Readiness",
        "Gate3.3 - Product Specification & Method Validation",
        "Gate3.4 - Environmental & Toxicology Data Package",
        "Gate3.5 - REACH / TSCA Dossier & Regulator Advice",
        "Gate3.6 - Executive Committee Registration & Pilot Release"
    ],
    "8.1 - Chemical registration dossier and submission": [
        "8.1.1 - Prepare jurisdiction-specific registration strategy and chemical inventory submissions",
        "8.1.2 - Compile substance identity, composition, impurity and physicochemical data dossiers"
    ],
    "8.2 - Regulatory filing, authority interaction and compliance records": [
        "8.2.1 - Complete toxicology, ecotoxicology and exposure data review as applicable",
        "8.2.2 - Submit REACH, TSCA, India and other applicable registration dossiers; track authority queries"
    ],
    "9.1 - Pilot plant campaign execution records": [
        "9.1.1 - Plan pilot plant campaign, batch sequence, raw material staging and resource allocation",
        "9.1.2 - Execute pilot batches and monitor critical process parameters and control limits"
    ],
    "9.2 - Pilot batch quality, yield and scale-up assessment": [
        "9.2.1 - Perform in-process sampling, finished product testing and batch record review",
        "9.2.2 - Evaluate pilot campaign yield, deviations, process capability and scale-up readiness"
    ],
    "10.1 - Demonstration-scale campaign performance package": [
        "10.1.1 - Execute demonstration-scale campaign using approved process and control strategy",
        "10.1.2 - Verify product quality, throughput, cycle time and operating reliability at demo scale"
    ],
    "10.2 - Commercial plant design basis and Gate 4 evidence": [
        "10.2.1 - Assess waste generation, solvent recovery, energy consumption and operating cost",
        "10.2.2 - Prepare demonstration-scale performance report and Gate 4 evidence package"
    ],
    "Gate 4 - Gate 4: Demo-Scale Proof Checkpoints": [
        "Gate4.1 - Pilot Plant Performance Review",
        "Gate4.2 - Demo-Scale Campaign Results",
        "Gate4.3 - Customer Qualification Evidence",
        "Gate4.4 - Process Safety Review Outcome",
        "Gate4.5 - Regulatory Registration Status",
        "Gate4.6 - Commercial Plant Design & Capex Approval"
    ],
    "11.1 - Commercial plant construction and commissioning package": [
        "11.1.1 - Complete detailed engineering, procurement, construction and installation of commercial plant",
        "11.1.2 - Commission reactors, separation systems, utilities, DCS, instrumentation and safety systems"
    ],
    "11.2 - Equipment qualification, process validation and readiness approval": [
        "11.2.1 - Execute equipment qualification, process validation and operator training",
        "11.2.2 - Complete commercial plant readiness, EHS clearance and Gate 5 approval dossier"
    ],
    "Gate 5 - Gate 5: Commercial Production Readiness Checkpoints": [
        "Gate5.1 - Commissioning & Performance Test Results",
        "Gate5.2 - Operating Procedures & Training",
        "Gate5.3 - Safety, Environmental & Permit Compliance",
        "Gate5.4 - Labeling (GHS / CLP), SDS & Emergency Response Plan",
        "Gate5.5 - Executive Committee Production Start Release"
    ],
    "12.1 - Commercial launch and first-batch release package": [
        "12.1.1 - Execute first commercial production batches and confirm approved release specifications",
        "12.1.2 - Monitor process performance, batch quality, yield and manufacturing KPIs during ramp-up"
    ],
    "12.2 - Ramp-up, product stewardship and post-launch improvement plan": [
        "12.2.1 - Establish product stewardship, SDS controls, customer technical support and change management",
        "12.2.2 - Complete launch review, supply continuity plan and post-launch improvement actions"
    ]
};

  allActivities: string[] = [
    "1.1.1 - Review industrial application demand, customer specifications and market opportunities",
    "1.1.2 - Benchmark competing chemical grades, suppliers and production technologies",
    "1.2.1 - Define target product profile, purity, concentration and performance attributes",
    "1.2.2 - Prepare preliminary business case, project economics and opportunity assessment",
    "2.1.1 - Screen reaction chemistry, formulation options and product feasibility",
    "2.1.2 - Assess raw material availability, critical reagent supply and vendor capability",
    "2.2.1 - Conduct preliminary process hazard, environmental and regulatory screening",
    "2.2.2 - Prepare feasibility report, target specifications and Gate 1 submission",
    "Gate1.1 - Market Demand & Competitive Benchmark Assessment",
    "Gate1.2 - Chemistry & Process Feasibility Assessment",
    "Gate1.3 - Preliminary Business Case & Cost of Manufacturing Model",
    "Gate1.4 - Patents & Freedom-to-Operate (FTO) Clearance",
    "Gate1.5 - Process Safety, Technology & Scale-Up Risk Assessment",
    "Gate1.6 - Regulatory Pathway & Registration Strategy Outline",
    "Gate1.7 - Executive Committee Concept Approval Release",
    "3.1.1 - Develop candidate synthesis routes and reaction pathway hypotheses",
    "3.1.2 - Conduct laboratory-scale reaction and catalyst screening experiments",
    "3.2.1 - Characterize intermediates, impurities and product composition using GC/HPLC and spectroscopy",
    "3.2.2 - Document route scouting results, material balance and preliminary yield assessment",
    "4.1.1 - Optimize reaction parameters, catalyst loading, temperature, pressure and residence time",
    "4.1.2 - Evaluate solvent systems, separation methods and purification sequence",
    "4.2.1 - Assess process yield, selectivity, impurity profile and batch-to-batch reproducibility",
    "4.2.2 - Develop analytical methods and establish in-process control limits",
    "5.1.1 - Compare candidate process routes against safety, quality, cost and sustainability criteria",
    "5.1.2 - Prepare process flow diagrams, mass and energy balances and equipment sizing basis",
    "5.2.1 - Define critical process parameters, control strategy and operating envelope",
    "5.2.2 - Complete basis of design, scale-up risk review and Gate 2 recommendation",
    "Gate2.1 - Yield & Selectivity Profile",
    "Gate2.2 - Process Robustness Proof",
    "Gate2.3 - Impurity & Waste Assessment",
    "Gate2.4 - Preliminary Safety Screening",
    "Gate2.5 - Basis of Design & Cost of Manufacturing Estimate",
    "Gate2.6 - Route Selection Committee Release",
    "6.1.1 - Translate laboratory process parameters into bench and pilot scale operating procedures",
    "6.1.2 - Execute bench-scale batches and assess yield, quality and process consistency",
    "6.2.1 - Develop downstream separation, solvent recovery and waste treatment operations",
    "6.2.2 - Qualify raw materials, utilities, equipment and measurement systems for pilot readiness",
    "7.1.1 - Complete process hazard analysis (HAZOP), risk assessment and safeguards review",
    "7.1.2 - Assess occupational exposure, chemical compatibility, fire and explosion protection",
    "7.2.1 - Develop environmental impact, effluent, emissions and hazardous waste management plans",
    "7.2.2 - Compile regulatory data package, safety studies and Gate 3 readiness evidence",
    "Gate3.1 - Process Hazard Analysis Package",
    "Gate3.2 - Pilot Plant Readiness",
    "Gate3.3 - Product Specification & Method Validation",
    "Gate3.4 - Environmental & Toxicology Data Package",
    "Gate3.5 - REACH / TSCA Dossier & Regulator Advice",
    "Gate3.6 - Executive Committee Registration & Pilot Release",
    "8.1.1 - Prepare jurisdiction-specific registration strategy and chemical inventory submissions",
    "8.1.2 - Compile substance identity, composition, impurity and physicochemical data dossiers",
    "8.2.1 - Complete toxicology, ecotoxicology and exposure data review as applicable",
    "8.2.2 - Submit REACH, TSCA, India and other applicable registration dossiers; track authority queries",
    "9.1.1 - Plan pilot plant campaign, batch sequence, raw material staging and resource allocation",
    "9.1.2 - Execute pilot batches and monitor critical process parameters and control limits",
    "9.2.1 - Perform in-process sampling, finished product testing and batch record review",
    "9.2.2 - Evaluate pilot campaign yield, deviations, process capability and scale-up readiness",
    "10.1.1 - Execute demonstration-scale campaign using approved process and control strategy",
    "10.1.2 - Verify product quality, throughput, cycle time and operating reliability at demo scale",
    "10.2.1 - Assess waste generation, solvent recovery, energy consumption and operating cost",
    "10.2.2 - Prepare demonstration-scale performance report and Gate 4 evidence package",
    "Gate4.1 - Pilot Plant Performance Review",
    "Gate4.2 - Demo-Scale Campaign Results",
    "Gate4.3 - Customer Qualification Evidence",
    "Gate4.4 - Process Safety Review Outcome",
    "Gate4.5 - Regulatory Registration Status",
    "Gate4.6 - Commercial Plant Design & Capex Approval",
    "11.1.1 - Complete detailed engineering, procurement, construction and installation of commercial plant",
    "11.1.2 - Commission reactors, separation systems, utilities, DCS, instrumentation and safety systems",
    "11.2.1 - Execute equipment qualification, process validation and operator training",
    "11.2.2 - Complete commercial plant readiness, EHS clearance and Gate 5 approval dossier",
    "Gate5.1 - Commissioning & Performance Test Results",
    "Gate5.2 - Operating Procedures & Training",
    "Gate5.3 - Safety, Environmental & Permit Compliance",
    "Gate5.4 - Labeling (GHS / CLP), SDS & Emergency Response Plan",
    "Gate5.5 - Executive Committee Production Start Release",
    "12.1.1 - Execute first commercial production batches and confirm approved release specifications",
    "12.1.2 - Monitor process performance, batch quality, yield and manufacturing KPIs during ramp-up",
    "12.2.1 - Establish product stewardship, SDS controls, customer technical support and change management",
    "12.2.2 - Complete launch review, supply continuity plan and post-launch improvement actions"
];

  predecessorList: PredecessorItem[] = [
    {
        "stage": "S1 - Opportunity Identification",
        "deliverable": "1.1 - Market opportunity and customer requirements baseline",
        "activity": "1.1.1 - Review industrial application demand, customer specifications and market opportunities",
        "type": "FS - Finish to Start - Finish A to Start B"
    },
    {
        "stage": "S1 - Opportunity Identification",
        "deliverable": "1.1 - Market opportunity and customer requirements baseline",
        "activity": "1.1.2 - Benchmark competing chemical grades, suppliers and production technologies",
        "type": "SS - Start to Start - A must start before B is started"
    }
];

  get paginatedPredecessors(): PredecessorItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.predecessorList.slice(startIndex, startIndex + this.pageSize);
  }

  constructor(
    private dialogRef: MatDialogRef<StagesPredecessorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  normalizeType(val?: string): string {
    if (!val) return this.typeOptions[0];
    const cleanVal = val.trim().toLowerCase();
    const found = this.typeOptions.find(t =>
      t.toLowerCase() === cleanVal ||
      t.toLowerCase().startsWith(cleanVal) ||
      cleanVal.startsWith(t.toLowerCase().slice(0, 2))
    );
    return found || this.typeOptions[0];
  }

  normalizeStage(val?: string): string {
    if (!val) return this.stageOptions[0];
    const cleanVal = val.trim().toLowerCase();
    const found = this.stageOptions.find(s =>
      s.toLowerCase() === cleanVal ||
      s.toLowerCase().includes(cleanVal) ||
      cleanVal.includes(s.toLowerCase().split(' - ')[1]?.toLowerCase() || '') ||
      cleanVal.includes(s.toLowerCase().split(' - ')[0]?.toLowerCase() || '')
    );
    return found || this.stageOptions[0];
  }

  normalizeDeliverable(stage: string, val?: string): string {
    if (!val) return '';
    const cleanVal = val.trim().toLowerCase();
    const list = this.getDeliverablesForStage(stage);
    const found = list.find(d =>
      d.toLowerCase() === cleanVal ||
      d.toLowerCase().includes(cleanVal) ||
      cleanVal.includes(d.toLowerCase().split(' - ')[1]?.toLowerCase() || '')
    );
    return found || val;
  }

  normalizeActivity(stage: string, del: string, val?: string): string {
    if (!val) return '';
    const cleanVal = val.trim().toLowerCase();
    const list = this.getActivitiesFor(stage, del);
    const found = list.find(a =>
      a.toLowerCase() === cleanVal ||
      a.toLowerCase().includes(cleanVal) ||
      cleanVal.includes(a.toLowerCase().split(' - ')[1]?.toLowerCase() || '')
    );
    return found || val;
  }

  ngOnInit(): void {
    if (this.data?.row) {
      this.taskName = this.data.row.task || '';
      this.taskSlNo = this.data.row.slNo || '';

      if (this.data.row.predecessorsData && Array.isArray(this.data.row.predecessorsData) && this.data.row.predecessorsData.length > 0) {
        this.predecessorList = this.data.row.predecessorsData.map((p: any) => {
          const stage = this.normalizeStage(p.stage);
          const deliverable = this.normalizeDeliverable(stage, p.deliverable);
          const activity = this.normalizeActivity(stage, deliverable, p.activity);
          const type = this.normalizeType(p.type);
          return {
            ...p,
            stage,
            deliverable,
            activity,
            type
          };
        });
      }
    }
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  getDeliverablesForStage(stage: string): string[] {
    if (!stage) {
      return Object.values(this.stageDeliverablesMap).flat();
    }
    if (this.stageDeliverablesMap[stage]) {
      return this.stageDeliverablesMap[stage];
    }
    const matchedKey = Object.keys(this.stageDeliverablesMap).find(k =>
      k.toLowerCase().includes(stage.toLowerCase()) || stage.toLowerCase().includes(k.toLowerCase())
    );
    if (matchedKey && this.stageDeliverablesMap[matchedKey]) {
      return this.stageDeliverablesMap[matchedKey];
    }
    return Object.values(this.stageDeliverablesMap).flat();
  }

  getActivitiesFor(stage: string, deliverable?: string): string[] {
    if (deliverable && this.stageActivitiesMap[deliverable]) {
      return this.stageActivitiesMap[deliverable];
    }
    if (deliverable) {
      const matchedDel = Object.keys(this.stageActivitiesMap).find(k =>
        k.toLowerCase().includes(deliverable.toLowerCase()) || deliverable.toLowerCase().includes(k.toLowerCase())
      );
      if (matchedDel && this.stageActivitiesMap[matchedDel]) {
        return this.stageActivitiesMap[matchedDel];
      }
    }
    if (stage) {
      const deliverables = this.getDeliverablesForStage(stage);
      const acts: string[] = [];
      deliverables.forEach(d => {
        if (this.stageActivitiesMap[d]) {
          acts.push(...this.stageActivitiesMap[d]);
        }
      });
      if (acts.length > 0) return acts;
    }
    return this.allActivities;
  }

  onStageChange(row: PredecessorItem): void {
    const availableDeliverables = this.getDeliverablesForStage(row.stage);
    if (row.deliverable && !availableDeliverables.includes(row.deliverable)) {
      row.deliverable = '';
    }
    const availableActs = this.getActivitiesFor(row.stage, row.deliverable);
    if (row.activity && !availableActs.includes(row.activity)) {
      row.activity = availableActs[0] || '';
    }
  }

  onDeliverableChange(row: PredecessorItem): void {
    const availableActs = this.getActivitiesFor(row.stage, row.deliverable);
    if (row.activity && !availableActs.includes(row.activity)) {
      row.activity = availableActs[0] || '';
    }
  }

  addRow(): void {
    const newRow: PredecessorItem = {
      stage: this.stageOptions[0] || 'S1 - Business Case',
      deliverable: '',
      activity: '',
      type: this.typeOptions[0]
    };
    this.pageIndex = 0;
    this.predecessorList.unshift(newRow);
  }

  deleteRow(row: PredecessorItem): void {
    const index = this.predecessorList.indexOf(row);
    if (index > -1) {
      this.predecessorList.splice(index, 1);
      if (this.pageIndex > 0 && this.pageIndex * this.pageSize >= this.predecessorList.length) {
        this.pageIndex = Math.max(0, this.pageIndex - 1);
      }
    }
  }

  save(): void {
    this.dialogRef.close({
      predecessors: this.predecessorList,
      count: this.predecessorList.length,
      predecessor: this.predecessorList.length > 0 ? String(this.predecessorList.length + 3) : '—'
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
