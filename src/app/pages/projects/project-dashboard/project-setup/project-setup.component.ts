import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

import { AddDeliverableComponent } from '../../../stages/stages-wbs/add-deliverable/add-deliverable.component';
import { AddActivityComponent } from '../../../stages/stages-wbs/add-activity/add-activity.component';
import { AddCriteriaComponent } from '../../../gates/gate-criteria/add-criteria/add-criteria.component';

// Interfaces to define our hierarchical data structure
export interface TaskItem {
  id: number;
  name: string;
  description?: string;
  completed: boolean;
}

export interface ModuleItem {
  id: number;
  name: string;
  description?: string;
  completed?: boolean;
  tasks: TaskItem[];
}

export interface StageItem {
  id: number;
  name: string;
  type: 'stage' | 'gate';
  completed?: boolean;
  modules: ModuleItem[];
  tasks?: TaskItem[];
}

@Component({
  selector: 'app-project-setup',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule
  ],
  templateUrl: './project-setup.component.html',
  styleUrl: './project-setup.component.scss',
})
export class ProjectSetupComponent implements OnInit {

  // Project Header Properties
  projectName: string = 'Vitamin-Enriched Fruit Beverage 250ml';
  projectCode: string = '2026/FMCG/006';
  dynamicBreadcrumb: string = 'Vitamin-Enriched Fruit Beverage 250ml - 2026/FMCG/006';

  selectedStage: StageItem | null = null;
  selectedModule: ModuleItem | null = null;

  stagesAndGates: StageItem[] = [
    {
      "id": 1,
      "name": "S1 - Consumer Need and Market Opportunity",
      "type": "stage",
      "completed": true,
      "modules": [
        {
          "id": 101,
          "name": "Consumer, Market and Competitor Product Analysis",
          "description": "Produce and obtain acceptance of the Consumer, Market and Competitor Product Analysis deliverable.",
          "completed": true,
          "tasks": [
            {
              "id": 1011,
              "name": "FMCG market and competitor landscape and competitor benchmarking",
              "description": "Compare approved and in-development consumer product launches of the reference product against relevant attributes, price points and market access; document gaps and opportunities.",
              "completed": true
            },
            {
              "id": 1012,
              "name": "Prescriber and payer needs research",
              "description": "Gather and analyse evidence from consumer research and market channels, identify unmet needs and switching drivers, and translate findings into documented requirements.",
              "completed": true
            },
            {
              "id": 1013,
              "name": "Target market and Regulatory Affairs & Compliance-pathway shortlist",
              "description": "Define selection criteria, assess Regulatory Affairs & Compliance pathways (CDSCO, FDA, FSSAI, ASEAN) and their constraints, and document the recommended shortlist with its rationale.",
              "completed": true
            }
          ]
        },
        {
          "id": 102,
          "name": "Program economics and risk screening",
          "description": "Produce and obtain acceptance of the program economics and risk screening deliverable.",
          "completed": true,
          "tasks": [
            {
              "id": 1021,
              "name": "Cost of manufacturing model and initial NPV",
              "description": "Estimate raw material costs, batch cycle time, packaging format economics and projected discounted cash flows.",
              "completed": true
            },
            {
              "id": 1022,
              "name": "Supply chain & food-grade ingredient risk screening",
              "description": "Screen ingredient availability, cold-chain transport hazards, shelf life constraints and alternative supplier routes.",
              "completed": true
            }
          ]
        },
        {
          "id": 103,
          "name": "Business case approval",
          "description": "Produce and obtain acceptance of the business case approval deliverable.",
          "completed": true,
          "tasks": [
            {
              "id": 1031,
              "name": "Business case consolidation and review",
              "description": "Consolidate consumer market, technical formulation and financial assessments into the formal business case document.",
              "completed": true
            },
            {
              "id": 1032,
              "name": "Program charter sign-off",
              "description": "Obtain steering committee sign-off and charter approval to initiate feasibility work.",
              "completed": true
            }
          ]
        }
      ]
    },
    {
      "id": 2,
      "name": "S2 - Market and Product Concept Validation",
      "type": "stage",
      "completed": true,
      "modules": [
        {
          "id": 201,
          "name": "Target Product Profile & Specification Definition",
          "description": "Define beverage nutritional profile, vitamin concentrations, viscosity, packaging, and sensory properties.",
          "completed": true,
          "tasks": [
            {
              "id": 2011,
              "name": "Specification & benchmark equivalence criteria",
              "description": "Establish critical quality attributes against leading market benchmarks.",
              "completed": true
            },
            {
              "id": 2012,
              "name": "Consumer sensory & stability acceptance criteria",
              "description": "Define taste profile, turbidity, shelf-life stability, and pasteurization parameters.",
              "completed": true
            }
          ]
        },
        {
          "id": 202,
          "name": "Program Costing Sheet Preparation & CDMO Selection",
          "description": "Prepare detailed costing breakdown and assess internal facilities vs co-packer CDMO selection.",
          "completed": true,
          "tasks": [
            {
              "id": 2021,
              "name": "Raw Material, packaging substrate & Reference Product Costing Breakdown",
              "description": "Reference product sample receipt, cold-chain logistics & customs clearance documentation.",
              "completed": true
            },
            {
              "id": 2022,
              "name": "Analytical Costing & External third-party testing and research partner Costing",
              "description": "Evaluate analytical characterization & product performance quality testing proposals.",
              "completed": true
            }
          ]
        }
      ]
    },
    {
      "id": 3,
      "name": "Gate 1: Business case and program charter approval",
      "type": "gate",
      "completed": true,
      "modules": [],
      "tasks": [
        {
          "id": 301,
          "name": "Reference product and market assessment complete",
          "description": "Target consumer segments, market size, competitor products and unmet consumer needs documented and approved.",
          "completed": true
        },
        {
          "id": 302,
          "name": "FMCG market and competitor landscape and IP / FTO review",
          "description": "Formal patent landscape search and freedom-to-operate clearance documented.",
          "completed": true
        },
        {
          "id": 303,
          "name": "Regulatory Affairs & Compliance pathway shortlist",
          "description": "Regulatory compliance pathway (FSSAI, CDSCO, ASEAN) and registration requirements baselined.",
          "completed": true
        },
        {
          "id": 304,
          "name": "Business case and NPV approved",
          "description": "Target product profile, projected COGS, volume targets and NPV threshold validated by finance.",
          "completed": true
        },
        {
          "id": 305,
          "name": "Budget and resource plan baselined",
          "description": "Development budget and cross-functional team allocation baselined.",
          "completed": true
        },
        {
          "id": 306,
          "name": "Risk register baselined",
          "description": "Critical formulation, sourcing and compliance risks identified with mitigation plans.",
          "completed": true
        },
        {
          "id": 307,
          "name": "Program charter signed",
          "description": "Executive committee sign-off granting authority to fund formulation and development.",
          "completed": true
        }
      ]
    },
    {
      "id": 4,
      "name": "S3 - Product Ideation and Concept Screening",
      "type": "stage",
      "completed": true,
      "modules": [
        {
          "id": 401,
          "name": "product formulation & food-grade ingredient / processing aid Procurement",
          "description": "Source food-grade vitamins, stabilizers, fruit concentrates, and natural flavors.",
          "completed": true,
          "tasks": [
            {
              "id": 4011,
              "name": "Host product formulation and Vector Characterization",
              "description": "Evaluate active ingredient source and nutrient assay profiles.",
              "completed": true
            },
            {
              "id": 4012,
              "name": "Culture packaging substrate and feed supplements screening",
              "description": "Screen food-grade acidulants, natural sweeteners, and antioxidant stabilizer blends.",
              "completed": true
            }
          ]
        }
      ]
    },
    {
      "id": 5,
      "name": "S4 - Product Formulation and Product Optimization",
      "type": "stage",
      "completed": false,
      "modules": [
        {
          "id": 501,
          "name": "POC Expression & ingredient refining",
          "description": "Formulate prototype beverages, optimize thermal processing parameters, and evaluate vitamin retention.",
          "completed": false,
          "tasks": [
            {
              "id": 5011,
              "name": "Formula and Product Consistency Study",
              "description": "Assess sensory attributes, phase stability, and vitamin retention across batch repetitions.",
              "completed": false
            },
            {
              "id": 5012,
              "name": "Upstream yield and Product Formulation optimization",
              "description": "Optimize mixing shear, pasteurization temperature, and bottling parameters.",
              "completed": false
            },
            {
              "id": 5013,
              "name": "Pilot mixing and blending vessel Batch Run",
              "description": "Execute bench-scale 5 L to 20 L mixing and homogenization trials.",
              "completed": false
            },
            {
              "id": 5014,
              "name": "Product efficacy and performance test Validation",
              "description": "Validate spectrophotometric and HPLC vitamin assay methods.",
              "completed": false
            },
            {
              "id": 5015,
              "name": "Bulk product Shelf-Life Stability Assessment",
              "description": "Accelerated thermal and photo-stability testing of bulk beverage liquid.",
              "completed": false
            }
          ]
        }
      ]
    },
    {
      "id": 6,
      "name": "S5 - Product Concept and Formula Selection",
      "type": "stage",
      "completed": false,
      "modules": [
        {
          "id": 601,
          "name": "GMP production batch Material Procurement",
          "description": "Procure commercial-grade aseptic packaging, caps, and validated vitamin premixes.",
          "completed": false,
          "tasks": [
            {
              "id": 6011,
              "name": "Vendor qualification & batch release testing",
              "description": "Qualify commercial suppliers for juice concentrate and barrier bottles.",
              "completed": false
            }
          ]
        }
      ]
    },
    {
      "id": 7,
      "name": "Gate 2: Product Concept and Formula Selection",
      "type": "gate",
      "completed": false,
      "modules": [],
      "tasks": [
        {
          "id": 701,
          "name": "Clone productivity and shelf-life stability data",
          "description": "Formula stability, nutrient retention and microbiological safety baselines established.",
          "completed": false
        },
        {
          "id": 702,
          "name": "Candidate process titer and quality attributes",
          "description": "Process yield, critical quality attributes and homogenization specs defined.",
          "completed": false
        },
        {
          "id": 703,
          "name": "Preliminary analytical similarity data",
          "description": "Physicochemical comparison to benchmark market standards completed.",
          "completed": false
        },
        {
          "id": 704,
          "name": "Master ingredient specification (MCB) plan",
          "description": "Master raw material and packaging specifications documented.",
          "completed": false
        },
        {
          "id": 705,
          "name": "Developability and Cost of Goods Sold (COGS) update",
          "description": "Target COGS and manufacturing economics re-validated.",
          "completed": false
        },
        {
          "id": 706,
          "name": "Product Concept and Formula Selection review",
          "description": "Formal steering committee gate review to authorize pilot scale manufacturing.",
          "completed": false
        }
      ]
    },
    {
      "id": 8,
      "name": "S6 - Product Formulation and Manufacturing Process Development",
      "type": "stage",
      "completed": false,
      "modules": [
        {
          "id": 801,
          "name": "pilot manufacturing run",
          "description": "Scale formulation to pilot plant 500 L vessels and optimize filling line speeds.",
          "completed": false,
          "tasks": [
            {
              "id": 8011,
              "name": "Pilot vessel thermal profiling",
              "description": "Map pasteurizer thermal dwell times and sterile transfer integrity.",
              "completed": false
            }
          ]
        }
      ]
    },
    {
      "id": 9,
      "name": "S7 - Prototype Testing and Product Safety Assessment",
      "type": "stage",
      "completed": false,
      "modules": [
        {
          "id": 901,
          "name": "bulk product Validation",
          "description": "Execute microbiological challenge testing and preservative efficacy studies.",
          "completed": false,
          "tasks": [
            {
              "id": 9011,
              "name": "Microbiological challenge testing",
              "description": "Validate shelf stability against standard indicator food microflora.",
              "completed": false
            }
          ]
        }
      ]
    },
    {
      "id": 10,
      "name": "S8 - Product Concept Approval Filing",
      "type": "stage",
      "completed": false,
      "modules": [
        {
          "id": 1001,
          "name": "finished consumer product Validation",
          "description": "Assemble nutrition facts labeling, allergen declarations, and packaging compatibility dossiers.",
          "completed": false,
          "tasks": [
            {
              "id": 10011,
              "name": "Process lock and analytical similarity approval",
              "description": "Lock manufacturing recipe and final product release criteria.",
              "completed": false
            }
          ]
        }
      ]
    },
    {
      "id": 11,
      "name": "Gate 3: Product Concept and Feasibility Approval",
      "type": "gate",
      "completed": false,
      "modules": [],
      "tasks": [
        {
          "id": 1101,
          "name": "Upstream and blending and finishing locked",
          "description": "Blending order and filling process parameters locked.",
          "completed": false
        },
        {
          "id": 1102,
          "name": "Analytical similarity package complete",
          "description": "Full comparative nutritional and sensory profiles verified.",
          "completed": false
        },
        {
          "id": 1103,
          "name": "Product efficacy and quality test methods validated",
          "description": "Analytical release assays validated with QC lab.",
          "completed": false
        },
        {
          "id": 1104,
          "name": "Bulk product and finished consumer product validated",
          "description": "Bulk intermediate and bottled product specs confirmed.",
          "completed": false
        },
        {
          "id": 1105,
          "name": "Shelf-life stability data",
          "description": "Real-time and accelerated stability curves within acceptable limits.",
          "completed": false
        },
        {
          "id": 1106,
          "name": "Comparability to reference product",
          "description": "Sensory triangle tests confirm parity or superiority to reference.",
          "completed": false
        },
        {
          "id": 1107,
          "name": "Product and Manufacturing Transfer readiness",
          "description": "Pilot to plant technology transfer documentation ready.",
          "completed": false
        },
        {
          "id": 1108,
          "name": "QA review",
          "description": "Quality assurance clearance for pilot plant consumer test batches.",
          "completed": false
        }
      ]
    },
    {
      "id": 12,
      "name": "S9 - Concept and Feasibility Validation",
      "type": "stage",
      "completed": false,
      "modules": [
        {
          "id": 1201,
          "name": "Product and Manufacturing Transfer Dossier Submission",
          "description": "Execute tech transfer to commercial bottling facility and train production operators.",
          "completed": false,
          "tasks": [
            {
              "id": 12011,
              "name": "Plant trial run and operator standard operating procedures",
              "description": "Deploy standard batch records and in-line CIP sanitization protocols.",
              "completed": false
            }
          ]
        }
      ]
    },
    {
      "id": 13,
      "name": "S10 - Pilot Production and Market Testing",
      "type": "stage",
      "completed": false,
      "modules": [
        {
          "id": 1301,
          "name": "GMP validation batches",
          "description": "Manufacture pilot commercial batches for consumer panels and test-market distribution.",
          "completed": false,
          "tasks": [
            {
              "id": 13011,
              "name": "Consumer panel placement and organoleptic feedback",
              "description": "Collect consumer liking scores, packaging usability, and repurchase intent.",
              "completed": false
            }
          ]
        }
      ]
    },
    {
      "id": 14,
      "name": "Gate 4: Consumer Validation and Product Performance Proof",
      "type": "gate",
      "completed": false,
      "modules": [],
      "tasks": [
        {
          "id": 1401,
          "name": "Non-consumer and market package",
          "description": "Quality testing and food contact safety certificates complete.",
          "completed": false
        },
        {
          "id": 1402,
          "name": "GMP consumer batch released",
          "description": "Commercial pilot batches released under QA oversight.",
          "completed": false
        },
        {
          "id": 1403,
          "name": "Consumer testing protocol finalized",
          "description": "Consumer acceptance test criteria and statistically valid results compiled.",
          "completed": false
        },
        {
          "id": 1404,
          "name": "Packaging line and site qualification",
          "description": "Co-packer / manufacturing plant audited and certified.",
          "completed": false
        },
        {
          "id": 1405,
          "name": "Product concept dossier ready",
          "description": "Product specifications and label claims file prepared.",
          "completed": false
        },
        {
          "id": 1406,
          "name": "Regulatory compliance scientific advice incorporated",
          "description": "Food standards compliance advice incorporated into master labeling.",
          "completed": false
        },
        {
          "id": 1407,
          "name": "Safety monitoring plan approved",
          "description": "Traceability and product recall procedures validated.",
          "completed": false
        }
      ]
    },
    {
      "id": 15,
      "name": "S11 - Commercial Scale-Up and Launch Preparation",
      "type": "stage",
      "completed": false,
      "modules": [
        {
          "id": 1501,
          "name": "Pivotal Comparative consumer and market Study",
          "description": "Complete commercial scale PPQ batches, warehouse distribution trials, and sales pipeline staging.",
          "completed": false,
          "tasks": [
            {
              "id": 15011,
              "name": "Commercial packaging and distribution validation",
              "description": "Vibration testing, pallet drop tests, and ambient transit temperature logging.",
              "completed": false
            }
          ]
        }
      ]
    },
    {
      "id": 16,
      "name": "Gate 5: Market Launch and Regulatory Readiness",
      "type": "gate",
      "completed": false,
      "modules": [],
      "tasks": [
        {
          "id": 1601,
          "name": "Pivotal study report",
          "description": "Final scale-up run reports and consumer acceptance metrics approved.",
          "completed": false
        },
        {
          "id": 1602,
          "name": "Statistical and shelf-life analysis",
          "description": "End-of-shelf-life nutritional claims validated.",
          "completed": false
        },
        {
          "id": 1603,
          "name": "Commercial manufacturing module complete",
          "description": "Batch manufacturing records and standard operating procedures approved.",
          "completed": false
        },
        {
          "id": 1604,
          "name": "Process validation (PPQ) data",
          "description": "Three consecutive commercial validation batches passed with zero deviations.",
          "completed": false
        },
        {
          "id": 1605,
          "name": "Shelf-life stability data",
          "description": "Stability testing confirms labeled expiry period under room temperature.",
          "completed": false
        },
        {
          "id": 1606,
          "name": "Packaging and labeling artwork approved",
          "description": "Regulatory approved artwork, barcodes, and allergen declarations released.",
          "completed": false
        },
        {
          "id": 1607,
          "name": "Market monitoring plan",
          "description": "Customer feedback tracking and quality complaint reporting established.",
          "completed": false
        },
        {
          "id": 1608,
          "name": "Market Launch submission review",
          "description": "Executive committee authorization for market release.",
          "completed": false
        },
        {
          "id": 1609,
          "name": "Final approval to file",
          "description": "Final commercial launch clearance signed.",
          "completed": false
        }
      ]
    },
    {
      "id": 17,
      "name": "S12 - Regulatory Approval and Commercial Product Launch",
      "type": "stage",
      "completed": false,
      "modules": [
        {
          "id": 1701,
          "name": "Market Launch / Regulatory Approval Dossier Filing",
          "description": "Filing regulatory declarations, first production batch dispatch, and retail distribution.",
          "completed": false,
          "tasks": [
            {
              "id": 17011,
              "name": "National retail rollout & distributor onboarding",
              "description": "Deliver initial launch shipments across modern trade and e-commerce distribution channels.",
              "completed": false
            }
          ]
        }
      ]
    }
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
    });

    // Default to the first stage (Feasibility, id: 1)
    const defaultStage = this.stagesAndGates[0];
    this.selectStage(defaultStage);
  }

  // --- Migrated Methods ---

  selectStage(stage: StageItem) {
    this.selectedStage = stage;
    if (stage.modules && stage.modules.length > 0) {
      this.selectedModule = stage.modules[0];
    } else {
      this.selectedModule = null;
    }
  }

  selectModule(moduleItem: ModuleItem) {
    this.selectedModule = moduleItem;
  }

  openAddDeliverableDialog(): void {
    if (!this.selectedStage || this.selectedStage.type === 'gate') return;

    const dialogRef = this.dialog.open(AddDeliverableComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: {
        stage: this.selectedStage.name,
        mode: 'add'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && (result.deliverableName || result.name)) {
        const newModule: ModuleItem = {
          id: Date.now(),
          name: result.deliverableName || result.name,
          description: result.description || '',
          completed: false,
          tasks: []
        };
        if (!this.selectedStage!.modules) {
          this.selectedStage!.modules = [];
        }
        this.selectedStage!.modules.push(newModule);
        this.selectedModule = newModule;
      }
    });
  }

  openAddActivityDialog(): void {
    if (!this.selectedStage || this.selectedStage.type === 'gate') return;

    const deliverables = this.selectedStage.modules?.map(m => m.name) || [];
    const currentDeliverable = this.selectedModule?.name || (deliverables.length > 0 ? deliverables[0] : '');

    const dialogRef = this.dialog.open(AddActivityComponent, {
      width: '1000px',
      maxWidth: '95vw',
      data: {
        stage: this.selectedStage.name,
        deliverable: currentDeliverable,
        deliverables: deliverables.length > 0 ? deliverables : [currentDeliverable || 'Deliverable'],
        mode: 'add'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && (result.activityName || result.task)) {
        const newActivity: TaskItem = {
          id: Date.now(),
          name: result.activityName || result.task,
          description: result.description || '',
          completed: false
        };

        let targetModule = this.selectedModule;
        if (result.deliverable && this.selectedStage?.modules) {
          const found = this.selectedStage.modules.find(m => m.name === result.deliverable);
          if (found) targetModule = found;
        }

        if (targetModule) {
          if (!targetModule.tasks) {
            targetModule.tasks = [];
          }
          targetModule.tasks.push(newActivity);
        }
      }
    });
  }

  openAddCriteriaDialog(): void {
    if (!this.selectedStage || this.selectedStage.type !== 'gate') return;

    const dialogRef = this.dialog.open(AddCriteriaComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: {
        stage: this.selectedStage.name,
        mode: 'add'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && (result.subject || result.question || result.name)) {
        const newCriterion: TaskItem = {
          id: Date.now(),
          name: result.subject || result.question || result.name || '',
          description: result.description || '',
          completed: false
        };

        if (this.selectedStage) {
          if (!this.selectedStage.tasks) {
            this.selectedStage.tasks = [];
          }
          this.selectedStage.tasks.push(newCriterion);
        }
      }
    });
  }

  editItem(item: any, type: string) {
    if (type === 'Criterion') {
      const dialogRef = this.dialog.open(AddCriteriaComponent, {
        width: '900px',
        maxWidth: '95vw',
        height: 'auto',
        data: {
          mode: 'edit',
          id: item.id,
          subject: item.name,
          question: item.name,
          description: item.description,
          priority: item.priority || 'High',
          mandatory: item.mandatory || false
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          item.name = result.subject || result.question || result.name || item.name;
          item.description = result.description !== undefined ? result.description : item.description;
        }
      });
    } else if (type === 'Module' || type === 'Deliverable') {
      const dialogRef = this.dialog.open(AddDeliverableComponent, {
        width: '600px',
        maxWidth: '90vw',
        data: {
          mode: 'edit',
          stage: this.selectedStage?.name || '',
          deliverableName: item.name,
          description: item.description
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && (result.deliverableName || result.name)) {
          item.name = result.deliverableName || result.name;
          item.description = result.description !== undefined ? result.description : item.description;
        }
      });
    } else if (type === 'Task' || type === 'Activity') {
      const deliverables = this.selectedStage?.modules?.map(m => m.name) || [];
      const dialogRef = this.dialog.open(AddActivityComponent, {
        width: '1000px',
        maxWidth: '95vw',
        data: {
          mode: 'edit',
          stage: this.selectedStage?.name || '',
          deliverable: this.selectedModule?.name || '',
          deliverables: deliverables.length > 0 ? deliverables : [this.selectedModule?.name || 'Deliverable'],
          activityName: item.name,
          task: item.name,
          description: item.description
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          item.name = result.activityName || result.task || item.name;
          item.description = result.description !== undefined ? result.description : item.description;
        }
      });
    }
  }

  deleteItem(item: any, type: string) {
    if (type === 'Task' || type === 'Criterion' || type === 'Activity') {
      if (this.selectedStage?.type === 'gate' && this.selectedStage.tasks) {
        const idx = this.selectedStage.tasks.indexOf(item);
        if (idx > -1) this.selectedStage.tasks.splice(idx, 1);
      } else if (this.selectedModule && this.selectedModule.tasks) {
        const idx = this.selectedModule.tasks.indexOf(item);
        if (idx > -1) this.selectedModule.tasks.splice(idx, 1);
      }
    } else if (type === 'Module' || type === 'Deliverable') {
      if (this.selectedStage && this.selectedStage.modules) {
        const idx = this.selectedStage.modules.indexOf(item);
        if (idx > -1) {
          this.selectedStage.modules.splice(idx, 1);
          if (this.selectedModule === item) {
            this.selectedModule = this.selectedStage.modules[0] || null;
          }
        }
      }
    }
  }

  toggleCompleted(event: Event, item: any) {
    event.stopPropagation();
    item.completed = !item.completed;
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParams: { code: this.projectCode || "2026/FMCG/006", name: this.projectName || "Vitamin-Enriched Fruit Beverage 250ml" }
    });
  }

}