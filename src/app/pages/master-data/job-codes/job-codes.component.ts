import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddJobCodeComponent } from './add-job-code/add-job-code.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from '../../../common/shared/confirmation-dialog/confirmation-dialog.component';

interface MasterItem {
  name: string;
  code: string;
  narration: string;
  description: string;
  hourlyRate: number;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-job-codes',
  imports: [
    FormsModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
  ],
  templateUrl: './job-codes.component.html',
  styleUrl: './job-codes.component.scss',
})
export class JobCodesComponent {
  constructor(private dialog: MatDialog) {}
  readonly items: MasterItem[] = [
  {
    "name": "Consumer Insights Lead",
    "code": "CINS-01",
    "narration": "Lead Consumer Insights and Category Strategy",
    "description": "Leads market demand discovery, occasion mapping and portfolio positioning.",
    "hourlyRate": 950,
    "status": "Active"
  },
  {
    "name": "Senior Market Research Analyst",
    "code": "CINS-02",
    "narration": "FMCG Market Research and Competitor Intelligence",
    "description": "Conducts competitor benchmarking, volume projections and channel dynamics.",
    "hourlyRate": 750,
    "status": "Active"
  },
  {
    "name": "Consumer Trend & Behavior Analyst",
    "code": "CINS-03",
    "narration": "Trend Identification and Demographic Analysis",
    "description": "Monitors dietary trends, ingredient perceptions and consumer behavioral shifts.",
    "hourlyRate": 650,
    "status": "Active"
  },
  {
    "name": "Occasion & Needs Space Specialist",
    "code": "CINS-04",
    "narration": "Usage Occasions and Category Gaps Mapping",
    "description": "Maps consumer consumption occasions and unmet functional needs.",
    "hourlyRate": 600,
    "status": "Active"
  },
  {
    "name": "Principal Consumer Researcher",
    "code": "CRE-01",
    "narration": "Consumer Validation and Research Design",
    "description": "Directs qualitative and quantitative consumer testing methodologies.",
    "hourlyRate": 900,
    "status": "Active"
  },
  {
    "name": "Qualitative Focus Group Moderator",
    "code": "CRE-02",
    "narration": "Consumer Focus Group and In-Depth Interviews",
    "description": "Moderates consumer panels and synthesizes sensory acceptance feedback.",
    "hourlyRate": 700,
    "status": "Active"
  },
  {
    "name": "Quantitative Validation Analyst",
    "code": "CRE-03",
    "narration": "Statistical Consumer Data and Preference Modeling",
    "description": "Analyzes TURF, penalty analysis and concept test statistical metrics.",
    "hourlyRate": 650,
    "status": "Active"
  },
  {
    "name": "Consumer Panel Coordinator",
    "code": "CRE-04",
    "narration": "Recruitment and Screening for Consumer Tests",
    "description": "Coordinates panel recruitment, blind sampling and sensory testing logistics.",
    "hourlyRate": 500,
    "status": "Active"
  },
  {
    "name": "Category Strategy Director",
    "code": "CAT-01",
    "narration": "Overall Category Vision and Brand Assortment",
    "description": "Develops long-term category roadmaps and channel margin frameworks.",
    "hourlyRate": 1100,
    "status": "Active"
  },
  {
    "name": "Assortment & Pricing Manager",
    "code": "CAT-02",
    "narration": "Pack-Price Architecture and Retail Margins",
    "description": "Optimizes price per unit volume, promotional tiering and retailer margins.",
    "hourlyRate": 850,
    "status": "Active"
  },
  {
    "name": "Channel Category Specialist",
    "code": "CAT-03",
    "narration": "Channel Placement and Modern Trade Assortment",
    "description": "Manages category planograms and channel-specific SKU variations.",
    "hourlyRate": 700,
    "status": "Active"
  },
  {
    "name": "Retail Assortment Planner",
    "code": "CAT-04",
    "narration": "SKU Rationalization and On-Shelf Availability",
    "description": "Forecasts shelf share, velocity per store and distribution depth.",
    "hourlyRate": 600,
    "status": "Active"
  },
  {
    "name": "Lead Formulation Scientist",
    "code": "RDI-01",
    "narration": "Principal Recipe and Formula Development",
    "description": "Designs food/beverage formulations, nutritional profiles and functional matrices.",
    "hourlyRate": 1100,
    "status": "Active"
  },
  {
    "name": "Food & Beverage Recipe Chemist",
    "code": "RDI-02",
    "narration": "Bench Formulation and Flavor Harmonization",
    "description": "Optimizes taste, texture, emulsification and mouthfeel of prototypes.",
    "hourlyRate": 850,
    "status": "Active"
  },
  {
    "name": "Ingredient Application Specialist",
    "code": "RDI-03",
    "narration": "Novel Food Ingredients and Stabilizers",
    "description": "Tests hydrocolloids, natural sweeteners, fortification premixes and acidity regulators.",
    "hourlyRate": 750,
    "status": "Active"
  },
  {
    "name": "Sensory & Bench Formulation Scientist",
    "code": "RDI-04",
    "narration": "Iterative Lab Prototypes and Stability Testing",
    "description": "Prepares benchtop iterations and monitors accelerated thermal aging.",
    "hourlyRate": 700,
    "status": "Active"
  },
  {
    "name": "Commercial Finance Director",
    "code": "FIN-01",
    "narration": "NPD Business Case Governance and Program NPV",
    "description": "Oversees product economics, capital investment thresholds and NPV model.",
    "hourlyRate": 1200,
    "status": "Active"
  },
  {
    "name": "Cost of Goods & Margin Analyst",
    "code": "FIN-02",
    "narration": "COGS Modeling and BOM Variance Control",
    "description": "Tracks raw and packaging material standard costs against targets.",
    "hourlyRate": 850,
    "status": "Active"
  },
  {
    "name": "Capex & Business Case Controller",
    "code": "FIN-03",
    "narration": "Equipment Investment and Payback Analysis",
    "description": "Models tooling, changeover parts and production line payback returns.",
    "hourlyRate": 900,
    "status": "Active"
  },
  {
    "name": "Financial Modeling Analyst",
    "code": "FIN-04",
    "narration": "Discounted Cash Flow and Scenario Sensitivity",
    "description": "Runs scenario simulations for raw material inflation and volume elasticity.",
    "hourlyRate": 700,
    "status": "Active"
  },
  {
    "name": "Ingredient Sourcing Manager",
    "code": "SUP-01",
    "narration": "Strategic Food-Grade Sourcing and Contracting",
    "description": "Manages supplier relationships for concentrates, flavors and packaging.",
    "hourlyRate": 850,
    "status": "Active"
  },
  {
    "name": "Supplier Quality Assurance Auditor",
    "code": "SUP-02",
    "narration": "Vendor Qualification and Auditing",
    "description": "Audits GFSI, BRC, FSSC 22000 and HACCP compliance of raw ingredient vendors.",
    "hourlyRate": 800,
    "status": "Active"
  },
  {
    "name": "Packaging Material Procurement Lead",
    "code": "SUP-03",
    "narration": "Barrier Films, Bottles and Corrugate Sourcing",
    "description": "Procures preforms, closures, aseptic cartons and secondary packaging.",
    "hourlyRate": 750,
    "status": "Active"
  },
  {
    "name": "Raw Material Sourcing Specialist",
    "code": "SUP-04",
    "narration": "Spot Market Purchases and Commodity Monitoring",
    "description": "Tracks commodity indices (sugar, pulp, resins) and secures supply buffer.",
    "hourlyRate": 650,
    "status": "Active"
  },
  {
    "name": "Packaging Engineering Lead",
    "code": "PKG-01",
    "narration": "Structural Packaging Design and Sustainability",
    "description": "Leads bottle, closure, pouch and corrugated shipper structural development.",
    "hourlyRate": 950,
    "status": "Active"
  },
  {
    "name": "Sustainable Material Technologist",
    "code": "PKG-02",
    "narration": "Recyclable Resins and Biodegradable Substrates",
    "description": "Validates PCR resin ratios, barrier mono-materials and light-weighting.",
    "hourlyRate": 850,
    "status": "Active"
  },
  {
    "name": "Barrier Film & Laminate Specialist",
    "code": "PKG-03",
    "narration": "OTR/WVTR Gas Barrier and Shelf-Life Protection",
    "description": "Optimizes oxygen and moisture transmission rates to prevent rancidity.",
    "hourlyRate": 750,
    "status": "Active"
  },
  {
    "name": "Packaging Line Compatibility Engineer",
    "code": "PKG-04",
    "narration": "Line Machinability and High-Speed FFS Feasibility",
    "description": "Tests high-speed thermoforming, sealing temperatures and capping torque.",
    "hourlyRate": 700,
    "status": "Active"
  },
  {
    "name": "Sensory & Consumer Science Lead",
    "code": "SENS-01",
    "narration": "Sensory Profiling and Objective Flavor Mapping",
    "description": "Directs sensory methodologies, QDA profiling and consumer preference tests.",
    "hourlyRate": 900,
    "status": "Active"
  },
  {
    "name": "Trained Sensory Panel Leader",
    "code": "SENS-02",
    "narration": "Sensory Panel Calibration and Descriptive Analysis",
    "description": "Calibrates internal panelists for aroma, sweetness, bitterness and acidity.",
    "hourlyRate": 750,
    "status": "Active"
  },
  {
    "name": "Descriptive Analysis Scientist",
    "code": "SENS-03",
    "narration": "Texture, Rheology and Sensory Correlation",
    "description": "Correlates instrumental viscosity data with sensory mouthfeel evaluations.",
    "hourlyRate": 700,
    "status": "Active"
  },
  {
    "name": "Shelf-Life Sensory Evaluator",
    "code": "SENS-04",
    "narration": "Real-Time and Accelerated Organoleptic Drift",
    "description": "Monitors color degradation, flavor fade and off-notes across storage periods.",
    "hourlyRate": 600,
    "status": "Active"
  },
  {
    "name": "Brand Marketing Director",
    "code": "MKT-01",
    "narration": "Brand Equity, Positioning and GTM Strategy",
    "description": "Owns launch commercialization strategy, brand archetype and value proposition.",
    "hourlyRate": 1200,
    "status": "Active"
  },
  {
    "name": "Product Launch Campaign Manager",
    "code": "MKT-02",
    "narration": "Integrated Marketing Campaigns and Sampling",
    "description": "Coordinates 360-degree consumer marketing, digital campaigns and ATL/BTL.",
    "hourlyRate": 900,
    "status": "Active"
  },
  {
    "name": "Digital & Trade Marketing Lead",
    "code": "MKT-03",
    "narration": "E-Commerce Activation and In-Store Merchandising",
    "description": "Drives quick-commerce banner ads, retail POS displays and sampling drives.",
    "hourlyRate": 800,
    "status": "Active"
  },
  {
    "name": "Packaging Artwork & Claims Specialist",
    "code": "MKT-04",
    "narration": "Front-of-Pack Artwork and Benefit Claims",
    "description": "Coordinates claims substantiation, nutrition tables and packaging prepress.",
    "hourlyRate": 650,
    "status": "Active"
  },
  {
    "name": "Program Director / PMO Lead",
    "code": "PMO-01",
    "narration": "NPD Stage-Gate Governance and Milestone Delivery",
    "description": "Oversees enterprise cross-functional NPD delivery and gate sign-offs.",
    "hourlyRate": 1200,
    "status": "Active"
  },
  {
    "name": "Stage-Gate Governance Manager",
    "code": "PMO-02",
    "narration": "Gate Criteria Audit and Gate Readiness Assessment",
    "description": "Enforces deliverables checklist, stage sign-offs and risk containment.",
    "hourlyRate": 950,
    "status": "Active"
  },
  {
    "name": "Agile Project Scrum Master",
    "code": "PMO-03",
    "narration": "Sprint Cadence and Cross-Functional Blockers",
    "description": "Facilitates bi-weekly sprints, Kanban boards and inter-departmental handoffs.",
    "hourlyRate": 850,
    "status": "Active"
  },
  {
    "name": "NPD Schedule & Resource Coordinator",
    "code": "PMO-04",
    "narration": "Master Schedule, WBS and Pilot Resource Allocation",
    "description": "Maintains critical path dependencies and pilot facility booking schedules.",
    "hourlyRate": 700,
    "status": "Active"
  },
  {
    "name": "Pilot Plant Operations Manager",
    "code": "MFG-01",
    "narration": "Pilot Scale-up and Batching Facility Management",
    "description": "Manages pilot processing lines, clean-in-place (CIP) and trial execution.",
    "hourlyRate": 1000,
    "status": "Active"
  },
  {
    "name": "Commercial Scale-up Process Engineer",
    "code": "MFG-02",
    "narration": "Tech Transfer from Pilot to Commercial Lines",
    "description": "Translates laboratory blend recipes to 10,000L commercial mixing vessels.",
    "hourlyRate": 850,
    "status": "Active"
  },
  {
    "name": "High-Shear Mixing & Batching Specialist",
    "code": "MFG-03",
    "narration": "Homogenization, Thermal Pasteurization & Emulsion",
    "description": "Optimizes homogenization pressures and heat exchanger pasteurization cycles.",
    "hourlyRate": 650,
    "status": "Active"
  },
  {
    "name": "Filling & Packaging Line Lead",
    "code": "MFG-04",
    "narration": "Aseptic Filling, Capping and Secondary Packing",
    "description": "Executes commercial trial packaging on high-speed blow-fill-seal lines.",
    "hourlyRate": 600,
    "status": "Active"
  },
  {
    "name": "Quality Assurance & Food Safety Manager",
    "code": "QA-01",
    "narration": "Corporate Food Safety Management System (FSMS)",
    "description": "Maintains FSSC 22000, HACCP plans and cross-contamination prevention.",
    "hourlyRate": 1000,
    "status": "Active"
  },
  {
    "name": "HACCP & GMP Lead Auditor",
    "code": "QA-02",
    "narration": "Hazard Analysis Critical Control Points (HACCP)",
    "description": "Monitors CCPs (metal detection, pasteurization temperature, filter screens).",
    "hourlyRate": 850,
    "status": "Active"
  },
  {
    "name": "Microbial & Contaminant Specialist",
    "code": "QA-03",
    "narration": "Pathogen Screening, Yeast/Mold and Total Count",
    "description": "Performs rapid bioburden testing, pathogen challenges and water potability.",
    "hourlyRate": 750,
    "status": "Active"
  },
  {
    "name": "Regulatory QA Documentation Officer",
    "code": "QA-04",
    "narration": "Batch Manufacturing Records & Certificate of Analysis",
    "description": "Audits finished product COAs, lot traceability and non-conformance CAPAs.",
    "hourlyRate": 600,
    "status": "Active"
  },
  {
    "name": "Supply Chain Industrialization Lead",
    "code": "SCM-01",
    "narration": "End-to-End NPD Supply Chain Readiness",
    "description": "Coordinates warehouse slotting, pallet configurations and transit testing.",
    "hourlyRate": 950,
    "status": "Active"
  },
  {
    "name": "Demand Forecasting & Planning Manager",
    "code": "SCM-02",
    "narration": "Initial Launch Pipeline Stock and Safety Buffers",
    "description": "Forecasts initial national rollout volume requirements and replenishment cycles.",
    "hourlyRate": 850,
    "status": "Active"
  },
  {
    "name": "Cold-Chain & Logistics Specialist",
    "code": "SCM-03",
    "narration": "Refrigerated Transport and Temperature Data Loggers",
    "description": "Validates reefer truck temperatures and distribution center handling protocols.",
    "hourlyRate": 700,
    "status": "Active"
  },
  {
    "name": "Finished Goods Distribution Planner",
    "code": "SCM-04",
    "narration": "Regional Hub Allocation and Distributor Dispatch",
    "description": "Manages regional hub stock transfers and retailer delivery appointment windows.",
    "hourlyRate": 600,
    "status": "Active"
  },
  {
    "name": "Regulatory Affairs Director",
    "code": "REG-01",
    "narration": "Regulatory Strategy and Compliance Authority Liaison",
    "description": "Manages national regulatory approvals (FSSAI, CDSCO, FDA) and category standards.",
    "hourlyRate": 1100,
    "status": "Active"
  },
  {
    "name": "Food Safety & FSSAI Specialist",
    "code": "REG-02",
    "narration": "Food Category Standards and Additive Permissibility",
    "description": "Validates ingredient dosage against FSSAI food additive positive lists.",
    "hourlyRate": 850,
    "status": "Active"
  },
  {
    "name": "Labeling Claims & Compliance Officer",
    "code": "REG-03",
    "narration": "Front-of-Pack Nutrition and Health Claims Validation",
    "description": "Audits ingredient declarations, allergen warnings and nutrition claims.",
    "hourlyRate": 750,
    "status": "Active"
  },
  {
    "name": "Regulatory Dossier & Submissions Lead",
    "code": "REG-04",
    "narration": "Proprietary Food Licenses and Dossier Preparation",
    "description": "Prepares technical dossiers and stability study submissions for authority clearance.",
    "hourlyRate": 700,
    "status": "Active"
  },
  {
    "name": "Modern Trade Channel Director",
    "code": "SLS-01",
    "narration": "Supermarket and Hypermarket Commercial Agreements",
    "description": "Negotiates joint business plans, shelf space and retail listings.",
    "hourlyRate": 1150,
    "status": "Active"
  },
  {
    "name": "Key Account Sales Manager",
    "code": "SLS-02",
    "narration": "National Chains and Quick-Commerce Accounts",
    "description": "Manages Blinkit, Zepto, Swiggy Instamart and Amazon retail execution.",
    "hourlyRate": 900,
    "status": "Active"
  },
  {
    "name": "Distributor Network Lead",
    "code": "SLS-03",
    "narration": "General Trade Wholesale & Distributor Alignment",
    "description": "Onboards regional stockists, secondary wholesale distribution and credit terms.",
    "hourlyRate": 800,
    "status": "Active"
  },
  {
    "name": "Retail Merchandising & Execution Specialist",
    "code": "SLS-04",
    "narration": "In-Store Display, Shelf Visibility and Stock Fill",
    "description": "Monitors store compliance, stock rotation (FIFO) and POS merchandising.",
    "hourlyRate": 600,
    "status": "Active"
  },
  {
    "name": "Environmental Health & Safety Manager",
    "code": "EHS-01",
    "narration": "Plant EHS Compliance and Environmental Sustainability",
    "description": "Directs plant workplace safety, occupational health and emission standards.",
    "hourlyRate": 900,
    "status": "Active"
  },
  {
    "name": "Food Plant Hygiene & Safety Lead",
    "code": "EHS-02",
    "narration": "Allergen Zoning, Personal Hygiene and Sanitation",
    "description": "Audits allergen segregation zones, gowning protocols and slip-fall safety.",
    "hourlyRate": 750,
    "status": "Active"
  },
  {
    "name": "Sustainability & Carbon Footprint Analyst",
    "code": "EHS-03",
    "narration": "EPR Plastic Waste and Carbon Intensity Accounting",
    "description": "Calculates Extended Producer Responsibility (EPR) and factory water footprint.",
    "hourlyRate": 700,
    "status": "Active"
  },
  {
    "name": "Chemical & Effluent Safety Specialist",
    "code": "EHS-04",
    "narration": "Cleaning Chemical Handling and ETP Monitoring",
    "description": "Oversees caustic/acid CIP chemical storage, MSDS safety and effluent compliance.",
    "hourlyRate": 650,
    "status": "Active"
  }
];

  showFilter = false;
  keyword = '';
  status = '';
  searchKeyword = '';
  searchStatus = '';
  pageIndex = 0;
  pageSize = 10;

  get filteredItems(): MasterItem[] {
    return this.items.filter((item) => {
      const keywordMatches =
        !this.searchKeyword ||
        item.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        item.code.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        item.narration.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchKeyword.toLowerCase());

      const statusMatches = !this.searchStatus || item.status === this.searchStatus;

      return keywordMatches && statusMatches;
    });
  }

  get paginatedItems(): MasterItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredItems.slice(startIndex, startIndex + this.pageSize);
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

  onAdd(): void {
    this.dialog.open(AddJobCodeComponent, {
      width: '800px',
      data: { mode: 'add' },
    });
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onEdit(item: MasterItem): void {
    this.dialog.open(AddJobCodeComponent, {
      width: '800px',
      data: { mode: 'edit', ...item },
    });
  }

  onDelete(item: MasterItem): void {
    this.dialog.open(DeleteConfirmationComponent, { width: '350px', data: item });
  }

  onStatusChange(item: MasterItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: { title: 'Change Status', content: 'Are you sure you want to change the status?' },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        item.status = item.status === 'Active' ? 'Inactive' : 'Active';
      }
    });
  }
}
