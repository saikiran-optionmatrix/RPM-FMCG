import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DocumentsPopComponent } from '../../../../common/shared/documents-pop/documents-pop.component';
import { RemarksPopComponent } from '../../../../common/shared/remarks-pop/remarks-pop.component';

export interface TtdCheckPoint {
  id: number;
  sNo: string;
  checkPoint: string;
  isGroupHeader?: boolean;
  isGroupPart?: boolean;
  groupSpan?: number;
  status: 'Yes' | 'No' | 'N/A' | null;
  remarks: string;
  documentsCount: number;
  documents?: { id: number; title: string; uploadedDate?: string }[];
}

@Component({
  selector: 'app-project-ttd',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatDialogModule
  ],
  templateUrl: './project-ttd.component.html',
  styleUrl: './project-ttd.component.scss'
})
export class ProjectTtdComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  // Header and Top Information Table fields
  productName: string = 'Vitamin-Enriched Fruit Beverage 250ml';
  projectCode: string = '2026/FMCG/006';
  strength: string = '40 mg/0.8 mL';
  market: string = 'India (CDSCO) & ASEAN';
  ttdNumber: string = 'PMTD/2026/FMCG/006';
  versionNumber: string = 'v2.1';

  // Save feedback state
  ttdNumberSaved: boolean = false;
  versionNumberSaved: boolean = false;

  // Check Points Data matching Image 1 and Image 2
  checkPointsList: TtdCheckPoint[] = [
  {
    "id": 1,
    "sNo": "1.",
    "checkPoint": "Title Page",
    "status": "Yes",
    "remarks": "Title page verified with exact program name, formulation specifications, and facility codes.",
    "documentsCount": 2,
    "documents": [
      {
        "id": 1,
        "title": "PMTD_Title_Page_Approved.pdf",
        "uploadedDate": "2026-02-10"
      },
      {
        "id": 2,
        "title": "Program_Dossier_Index.pdf",
        "uploadedDate": "2026-02-12"
      }
    ]
  },
  {
    "id": 2,
    "sNo": "2.",
    "checkPoint": "Approval Page",
    "status": "Yes",
    "remarks": "Signed off by Head of Product Formulation, Technology Transfer Lead, and Quality Head.",
    "documentsCount": 3,
    "documents": [
      {
        "id": 1,
        "title": "Executed_Signoff_Page.pdf",
        "uploadedDate": "2026-02-14"
      },
      {
        "id": 2,
        "title": "Quality_Approval_Certificate.pdf",
        "uploadedDate": "2026-02-15"
      },
      {
        "id": 3,
        "title": "Steering_Committee_Minutes.pdf",
        "uploadedDate": "2026-02-16"
      }
    ]
  },
  {
    "id": 3,
    "sNo": "3.",
    "checkPoint": "Table of contents",
    "status": "Yes",
    "remarks": "Master index and cross-references verified against CTD format standards.",
    "documentsCount": 1,
    "documents": [
      {
        "id": 1,
        "title": "Table_of_Contents_v2.1.pdf",
        "uploadedDate": "2026-02-18"
      }
    ]
  },
  {
    "id": 4,
    "sNo": "4.",
    "checkPoint": "Scope and Process Flow Scheme",
    "status": "Yes",
    "remarks": "Process flow scheme defines beverage blending, homogenization, pasteurization and filling line operations.",
    "documentsCount": 2,
    "documents": [
      {
        "id": 1,
        "title": "Process_Flow_Scheme_Diagram.pdf",
        "uploadedDate": "2026-02-20"
      }
    ]
  },
  {
    "id": 5,
    "sNo": "5.",
    "checkPoint": "Biosafety and rDNA Approvals (IBSC / RCGM)",
    "status": "Yes",
    "remarks": "Food safety compliance approvals and statutory clearances baselined.",
    "documentsCount": 2,
    "documents": [
      {
        "id": 1,
        "title": "Food_Safety_Statutory_Clearance.pdf",
        "uploadedDate": "2026-02-25"
      }
    ]
  },
  {
    "id": 6,
    "sNo": "6.",
    "checkPoint": "Procurement Package (product formulation, packaging substrate, Resins and Single-Use Consumables)",
    "status": "Yes",
    "remarks": "Raw material vendor qualifications, juice concentrate specs, and aseptic container specs approved.",
    "documentsCount": 4,
    "documents": [
      {
        "id": 1,
        "title": "Procurement_Package_Specification.pdf",
        "uploadedDate": "2026-03-01"
      }
    ]
  },
  {
    "id": 7,
    "sNo": "7.",
    "checkPoint": "Bulk Product Specifications and Standard Test Procedures",
    "status": "Yes",
    "remarks": "Bulk beverage intermediate release specs, vitamin assay, pH, Brix, and microbial limits.",
    "documentsCount": 3,
    "documents": [
      {
        "id": 1,
        "title": "Bulk_Product_STP_v2.pdf",
        "uploadedDate": "2026-03-10"
      }
    ]
  },
  {
    "id": 8,
    "sNo": "8.",
    "checkPoint": "Raw Material and Packaging Material and packaging material and Product Formulation Development packaging substrate Specifications and Standard Test Procedures",
    "status": "Yes",
    "remarks": "Specifications and test procedures for vitamins, citric acid, natural flavors, stabilizers, and barrier bottles.",
    "documentsCount": 5,
    "documents": [
      {
        "id": 1,
        "title": "RM_PM_Packaging_STP_Consolidated.pdf",
        "uploadedDate": "2026-03-15"
      }
    ]
  },
  {
    "id": 9,
    "sNo": "9.",
    "checkPoint": "Primary Container Closure Specifications and Standard Test Procedures (Syringe, Plunger, Needle Shield)",
    "status": "Yes",
    "remarks": "Barrier container closure integrity, cap induction seal and oxygen transmission rate verification.",
    "documentsCount": 2,
    "documents": [
      {
        "id": 1,
        "title": "Container_Closure_Integrity_STP.pdf",
        "uploadedDate": "2026-03-20"
      }
    ]
  },
  {
    "id": 10,
    "sNo": "10.",
    "checkPoint": "Finished Consumer Product Specifications and Standard Test Procedures: In-process, Release and Shelf-life",
    "status": "Yes",
    "remarks": "Release specifications for bottled beverage, sensory triangle test, and accelerated shelf-life limits.",
    "documentsCount": 4,
    "documents": [
      {
        "id": 1,
        "title": "Finished_Product_Release_STP.pdf",
        "uploadedDate": "2026-03-25"
      }
    ]
  },
  {
    "id": 11,
    "sNo": "11.",
    "checkPoint": "Master Batch Record (Upstream, Downstream and Fill-Finish)",
    "status": "Yes",
    "remarks": "Master formulation batch manufacturing record for syrup preparation, blending, pasteurization and bottling.",
    "documentsCount": 3,
    "documents": [
      {
        "id": 1,
        "title": "MBR_Beverage_Blending_Bottling.pdf",
        "uploadedDate": "2026-04-05"
      }
    ]
  },
  {
    "id": 12,
    "sNo": "12.",
    "checkPoint": "Master Packaging Record (Prefilled Syringe Assembly and Labeling)",
    "status": "Yes",
    "remarks": "Master packaging record for sleeve labeling, carton collation, and shrink-wrap packaging.",
    "documentsCount": 2,
    "documents": [
      {
        "id": 1,
        "title": "MPR_Labeling_Carton_Packaging.pdf",
        "uploadedDate": "2026-04-12"
      }
    ]
  },
  {
    "id": 13,
    "sNo": "13.",
    "checkPoint": "Shelf-Life Stability Plan (Bulk Product and Finished Consumer Product)",
    "status": "Yes",
    "remarks": "Real-time and accelerated stability study protocols (25°C/60% RH & 40°C/75% RH).",
    "documentsCount": 4,
    "documents": [
      {
        "id": 1,
        "title": "Shelf_Life_Stability_Protocol.pdf",
        "uploadedDate": "2026-04-20"
      }
    ]
  },
  {
    "id": 14,
    "sNo": "14.",
    "checkPoint": "Product Formulation History and Master / Working ingredient specification (MCB / WCB) Characterization",
    "status": "No",
    "remarks": "Master ingredient specification pedigree, nutrient assay baseline, and supplier certificate of analysis archive.",
    "documentsCount": 5,
    "documents": [
      {
        "id": 1,
        "title": "Ingredient_Specification_Characterization.pdf",
        "uploadedDate": "2026-05-01"
      }
    ]
  },
  {
    "id": 15,
    "sNo": "15.",
    "checkPoint": "Ingredient Preparation Description (Seed Train, Mixing and Blending vessel and Harvest)",
    "status": "No",
    "remarks": "Detailed syrup dissolution, high-shear vitamin mixing, and clarification filtration description.",
    "documentsCount": 4,
    "documents": [
      {
        "id": 1,
        "title": "Syrup_Prep_Dissolution_Description.pdf",
        "uploadedDate": "2026-05-05"
      }
    ]
  },
  {
    "id": 16,
    "sNo": "16.",
    "checkPoint": "Blending, Finishing and Quality Control Process Description (Ingredient separation and quality testing, Viral Inactivation and UF/DF)",
    "status": "No",
    "remarks": "Continuous in-line blending, de-aeration, and ultra-clean thermal pasteurization sequence.",
    "documentsCount": 4,
    "documents": [
      {
        "id": 1,
        "title": "Blending_Finishing_QC_Description.pdf",
        "uploadedDate": "2026-05-10"
      }
    ]
  },
  {
    "id": 17,
    "sNo": "17.",
    "checkPoint": "Critical Quality Attributes (Critical-to-Quality (CTQ) product attributes) and Control Strategy",
    "status": "No",
    "remarks": "CTQ risk assessment, in-line turbidity monitoring, Brix controls, and vitamin fortification strategy.",
    "documentsCount": 3,
    "documents": [
      {
        "id": 1,
        "title": "CTQ_Control_Strategy_Matrix.pdf",
        "uploadedDate": "2026-05-15"
      }
    ]
  },
  {
    "id": 18,
    "sNo": "18.",
    "checkPoint": "Quality Testing Method Validation and Transfer Protocols (Product efficacy and performance, Charge Variants, Glycan, Purity)",
    "status": "No",
    "remarks": "HPLC analytical test validation protocols for vitamins B, C, D and antioxidant potency assays.",
    "documentsCount": 6,
    "documents": [
      {
        "id": 1,
        "title": "Vitamin_Assay_Method_Validation.pdf",
        "uploadedDate": "2026-05-20"
      }
    ]
  },
  {
    "id": 19,
    "sNo": "19.",
    "checkPoint": "Reference Product Analytical Similarity and Comparability Plan",
    "status": "No",
    "remarks": "Sensory triangle test, head-to-head nutritional profile and colorimetric comparability package.",
    "documentsCount": 4,
    "documents": [
      {
        "id": 1,
        "title": "Reference_Product_Comparability_Plan.pdf",
        "uploadedDate": "2026-05-25"
      }
    ]
  },
  {
    "id": 20,
    "sNo": "20.",
    "checkPoint": "Viral Safety and Adventitious Agent Testing Plan",
    "status": "No",
    "remarks": "Microbiological surveillance plan, pathogenic indicator organisms, and water system testing.",
    "documentsCount": 2,
    "documents": [
      {
        "id": 1,
        "title": "Microbiological_Safety_Plan.pdf",
        "uploadedDate": "2026-05-28"
      }
    ]
  },
  {
    "id": 21,
    "sNo": "21.",
    "checkPoint": "Immunogenicity (Anti-Drug ingredient blend) quality test Plan",
    "status": "No",
    "remarks": "Food allergen safety screening, cross-contact risk assessment and ELISA allergen verification.",
    "documentsCount": 2,
    "documents": [
      {
        "id": 1,
        "title": "Allergen_Safety_Assessment.pdf",
        "uploadedDate": "2026-06-01"
      }
    ]
  },
  {
    "id": 22,
    "sNo": "22.",
    "checkPoint": "Process Validation (PPQ) Protocol",
    "status": "No",
    "remarks": "Protocol for 3 consecutive commercial scale validation batches at target bottling line speed.",
    "documentsCount": 3,
    "documents": [
      {
        "id": 1,
        "title": "PPQ_Commercial_Validation_Protocol.pdf",
        "uploadedDate": "2026-06-05"
      }
    ]
  }
];

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name']) {
        this.productName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      if (params['strength']) {
        this.strength = params['strength'];
      }
      if (params['market']) {
        this.market = params['market'];
      }
      if (params['ttdNumber']) {
        this.ttdNumber = params['ttdNumber'];
      }
      if (params['versionNumber']) {
        this.versionNumber = params['versionNumber'];
      }
    });
  }

  // Set Status: Mutually exclusive between Yes, No, N/A
  setStatus(item: TtdCheckPoint, status: 'Yes' | 'No' | 'N/A'): void {
    if (item.status === status) {
      item.status = null;
    } else {
      item.status = status;
    }
  }

  // Save TTD Number
  saveTtdNumber(): void {
    this.ttdNumberSaved = true;
    setTimeout(() => {
      this.ttdNumberSaved = false;
    }, 2000);
  }

  // Save Version Number
  saveVersionNumber(): void {
    this.versionNumberSaved = true;
    setTimeout(() => {
      this.versionNumberSaved = false;
    }, 2000);
  }

  // Click on Documents number opens DocumentsPopComponent
  openDocuments(item: TtdCheckPoint): void {
    this.dialog.open(DocumentsPopComponent, {
      width: '850px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: {
        title: `Documents — ${item.checkPoint}`,
        documents: item.documents || [
          { id: 1, title: `${item.checkPoint.replace(/[^a-zA-Z0-9]/g, '_')}_DQA_Signed.pdf`, uploadedDate: '2026-03-15' },
          { id: 2, title: `${item.checkPoint.replace(/[^a-zA-Z0-9]/g, '_')}_Execution_Record.pdf`, uploadedDate: '2026-03-20' }
        ]
      }
    });
  }

  // Click on Remarks opens RemarksPopComponent
  openRemarks(item: TtdCheckPoint): void {
    const dialogRef = this.dialog.open(RemarksPopComponent, {
      width: '500px',
      data: {
        title: `Remarks — ${item.checkPoint}`,
        placeholder: 'Enter remarks...',
        notes: item.remarks || ''
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result !== undefined && result !== null) {
        if (typeof result === 'string') {
          item.remarks = result;
        } else if (result && typeof result.notes === 'string') {
          item.remarks = result.notes;
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParams: { code: this.projectCode, name: this.productName }
    });
  }
}
