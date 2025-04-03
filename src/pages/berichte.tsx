import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Income, Expense, MonthlyData } from '@/types';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { 
  FiDownload, 
  FiBarChart2, 
  FiTrendingUp, 
  FiTrendingDown,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import { exportFinancialSummaryToExcel } from '@/utils/excelExport';

// Mock data - in a real app, this would come from a database
const mockIncomeData: Income[] = [
  // März 2023
  {
    id: '1',
    date: '2023-03-10',
    amount: 1500.00,
    category: 'Druckaufträge',
    description: 'Broschüren-Druck für Marketingkampagne',
    client: 'Schmidt GmbH',
    invoiceNumber: 'INV-2023-001',
    createdAt: '2023-03-10T10:00:00Z',
    updatedAt: '2023-03-10T10:00:00Z',
  },
  {
    id: '2',
    date: '2023-03-15',
    amount: 950.00,
    category: 'Digitaldruck',
    description: 'Visitenkarten und Briefpapier',
    client: 'M. Müller',
    invoiceNumber: 'INV-2023-002',
    createdAt: '2023-03-15T14:30:00Z',
    updatedAt: '2023-03-15T14:30:00Z',
  },
  {
    id: '3',
    date: '2023-03-22',
    amount: 780.00,
    category: 'Siebdruck',
    description: 'T-Shirt-Druck für Firmenveranstaltung',
    client: 'EventPro GmbH',
    invoiceNumber: 'INV-2023-003',
    createdAt: '2023-03-22T11:00:00Z',
    updatedAt: '2023-03-22T11:00:00Z',
  },
  // Zusätzliche Einträge für März 2023
  {
    id: '101',
    date: '2023-03-02',
    amount: 620.00,
    category: 'Druckaufträge',
    description: 'Flyer für lokale Veranstaltung',
    client: 'Stadtmarketing GmbH',
    invoiceNumber: 'INV-2023-101',
    createdAt: '2023-03-02T09:30:00Z',
    updatedAt: '2023-03-02T09:30:00Z',
  },
  {
    id: '102',
    date: '2023-03-04',
    amount: 850.00,
    category: 'Großformatdruck',
    description: 'Poster für Galerieeröffnung',
    client: 'Kunstgalerie Modern',
    invoiceNumber: 'INV-2023-102',
    createdAt: '2023-03-04T11:15:00Z',
    updatedAt: '2023-03-04T11:15:00Z',
  },
  {
    id: '103',
    date: '2023-03-08',
    amount: 320.00,
    category: 'Digitaldruck',
    description: 'Broschüren für Patienteninformation',
    client: 'Praxis Dr. Schneider',
    invoiceNumber: 'INV-2023-103',
    createdAt: '2023-03-08T14:00:00Z',
    updatedAt: '2023-03-08T14:00:00Z',
  },
  {
    id: '104',
    date: '2023-03-12',
    amount: 480.00,
    category: 'Buchdruck',
    description: 'Selbstpubliziertes Buch',
    client: 'Autor Klaus Weber',
    invoiceNumber: 'INV-2023-104',
    createdAt: '2023-03-12T10:45:00Z',
    updatedAt: '2023-03-12T10:45:00Z',
  },
  {
    id: '105',
    date: '2023-03-18',
    amount: 290.00,
    category: 'Siebdruck',
    description: 'Werbegeschenke mit Logo',
    client: 'Versicherung Müller AG',
    invoiceNumber: 'INV-2023-105',
    createdAt: '2023-03-18T15:30:00Z',
    updatedAt: '2023-03-18T15:30:00Z',
  },
  {
    id: '106',
    date: '2023-03-24',
    amount: 740.00,
    category: 'Druckaufträge',
    description: 'Katalog für Frühjahrssortiment',
    client: 'Modehaus Chic',
    invoiceNumber: 'INV-2023-106',
    createdAt: '2023-03-24T13:15:00Z',
    updatedAt: '2023-03-24T13:15:00Z',
  },
  {
    id: '107',
    date: '2023-03-27',
    amount: 920.00,
    category: 'Großformatdruck',
    description: 'Baustellenbanner',
    client: 'Bau & Projektierung GmbH',
    invoiceNumber: 'INV-2023-107',
    createdAt: '2023-03-27T09:00:00Z',
    updatedAt: '2023-03-27T09:00:00Z',
  },
  {
    id: '108',
    date: '2023-03-29',
    amount: 540.00,
    category: 'Digitaldruck',
    description: 'Schulungsunterlagen',
    client: 'Bildungszentrum Zukunft',
    invoiceNumber: 'INV-2023-108',
    createdAt: '2023-03-29T14:45:00Z',
    updatedAt: '2023-03-29T14:45:00Z',
  },
  {
    id: '109',
    date: '2023-03-30',
    amount: 380.00,
    category: 'Siebdruck',
    description: 'T-Shirts für Sportverein',
    client: 'TSV Blau-Weiß',
    invoiceNumber: 'INV-2023-109',
    createdAt: '2023-03-30T10:30:00Z',
    updatedAt: '2023-03-30T10:30:00Z',
  },
  // April 2023
  {
    id: '4',
    date: '2023-04-05',
    amount: 2200.00,
    category: 'Großformatdruck',
    description: 'Messebanner und Displays',
    client: 'Tech Solutions AG',
    invoiceNumber: 'INV-2023-004',
    createdAt: '2023-04-05T09:15:00Z',
    updatedAt: '2023-04-05T09:15:00Z',
  },
  {
    id: '5',
    date: '2023-04-12',
    amount: 3400.00,
    category: 'Druckaufträge',
    description: 'Produktkataloge mit Spezialpapier',
    client: 'Möbel Meister KG',
    invoiceNumber: 'INV-2023-005',
    createdAt: '2023-04-12T13:45:00Z',
    updatedAt: '2023-04-12T13:45:00Z',
  },
  {
    id: '6',
    date: '2023-04-18',
    amount: 560.00,
    category: 'Digitaldruck',
    description: 'Flyer für Saisonverkauf',
    client: 'Mode Express GmbH',
    invoiceNumber: 'INV-2023-006',
    createdAt: '2023-04-18T10:30:00Z',
    updatedAt: '2023-04-18T10:30:00Z',
  },
  // Zusätzliche Einträge für April 2023
  {
    id: '110',
    date: '2023-04-02',
    amount: 780.00,
    category: 'Druckaufträge',
    description: 'Jahresbericht mit Bindung',
    client: 'Steuerkanzlei Hoffmann',
    invoiceNumber: 'INV-2023-110',
    createdAt: '2023-04-02T11:30:00Z',
    updatedAt: '2023-04-02T11:30:00Z',
  },
  {
    id: '111',
    date: '2023-04-04',
    amount: 920.00,
    category: 'Großformatdruck',
    description: 'Werbeplakat für Kinopremiere',
    client: 'CineView Entertainment',
    invoiceNumber: 'INV-2023-111',
    createdAt: '2023-04-04T14:15:00Z',
    updatedAt: '2023-04-04T14:15:00Z',
  },
  {
    id: '112',
    date: '2023-04-07',
    amount: 450.00,
    category: 'Digitaldruck',
    description: 'Hochzeitseinladungen',
    client: 'Familie Wagner',
    invoiceNumber: 'INV-2023-112',
    createdAt: '2023-04-07T09:45:00Z',
    updatedAt: '2023-04-07T09:45:00Z',
  },
  {
    id: '113',
    date: '2023-04-10',
    amount: 680.00,
    category: 'Buchdruck',
    description: 'Promotion-Exemplare',
    client: 'Verlag Neuzeit',
    invoiceNumber: 'INV-2023-113',
    createdAt: '2023-04-10T13:00:00Z',
    updatedAt: '2023-04-10T13:00:00Z',
  },
  {
    id: '114',
    date: '2023-04-14',
    amount: 590.00,
    category: 'Siebdruck',
    description: 'Messetaschen mit Logo',
    client: 'Eventmanagement Konferenz',
    invoiceNumber: 'INV-2023-114',
    createdAt: '2023-04-14T15:45:00Z',
    updatedAt: '2023-04-14T15:45:00Z',
  },
  {
    id: '115',
    date: '2023-04-20',
    amount: 820.00,
    category: 'Druckaufträge',
    description: 'Imagebroschüre Neuauflage',
    client: 'Architekturbüro Modern',
    invoiceNumber: 'INV-2023-115',
    createdAt: '2023-04-20T10:15:00Z',
    updatedAt: '2023-04-20T10:15:00Z',
  },
  {
    id: '116',
    date: '2023-04-23',
    amount: 1100.00,
    category: 'Großformatdruck',
    description: 'Fassadenwerbung',
    client: 'Autohaus Premium',
    invoiceNumber: 'INV-2023-116',
    createdAt: '2023-04-23T09:30:00Z',
    updatedAt: '2023-04-23T09:30:00Z',
  },
  {
    id: '117',
    date: '2023-04-25',
    amount: 480.00,
    category: 'Digitaldruck',
    description: 'Personalisierte Notizbücher',
    client: 'Coaching Academy',
    invoiceNumber: 'INV-2023-117',
    createdAt: '2023-04-25T14:00:00Z',
    updatedAt: '2023-04-25T14:00:00Z',
  },
  {
    id: '118',
    date: '2023-04-28',
    amount: 750.00,
    category: 'Siebdruck',
    description: 'Firmenuniformen',
    client: 'Gastro Service GmbH',
    invoiceNumber: 'INV-2023-118',
    createdAt: '2023-04-28T11:45:00Z',
    updatedAt: '2023-04-28T11:45:00Z',
  },
  // Mai 2023
  {
    id: '7',
    date: '2023-05-03',
    amount: 1250.00,
    category: 'Buchdruck',
    description: 'Hardcover-Bücher für Autorenverlag',
    client: 'Schreib & Co. KG',
    invoiceNumber: 'INV-2023-007',
    createdAt: '2023-05-03T09:00:00Z',
    updatedAt: '2023-05-03T09:00:00Z',
  },
  {
    id: '8',
    date: '2023-05-17',
    amount: 1800.00,
    category: 'Großformatdruck',
    description: 'Werbeplakate für Kinokampagne',
    client: 'CineMotion AG',
    invoiceNumber: 'INV-2023-008',
    createdAt: '2023-05-17T14:15:00Z',
    updatedAt: '2023-05-17T14:15:00Z',
  },
  // Juni 2023
  {
    id: '9',
    date: '2023-06-05',
    amount: 2100.00,
    category: 'Druckaufträge',
    description: 'Jahresberichte mit Bindung',
    client: 'Finanztreu GmbH',
    invoiceNumber: 'INV-2023-009',
    createdAt: '2023-06-05T11:30:00Z',
    updatedAt: '2023-06-05T11:30:00Z',
  },
  {
    id: '10',
    date: '2023-06-22',
    amount: 970.00,
    category: 'Siebdruck',
    description: 'Merchandise für Sportverein',
    client: 'SV Blau-Weiß e.V.',
    invoiceNumber: 'INV-2023-010',
    createdAt: '2023-06-22T10:00:00Z',
    updatedAt: '2023-06-22T10:00:00Z',
  },
  // Juli 2023
  {
    id: '11',
    date: '2023-07-08',
    amount: 2800.00,
    category: 'Digitaldruck',
    description: 'Personalisierte Mailings',
    client: 'Marketingagentur Kreativ GmbH',
    invoiceNumber: 'INV-2023-011',
    createdAt: '2023-07-08T09:45:00Z',
    updatedAt: '2023-07-08T09:45:00Z',
  },
  {
    id: '12',
    date: '2023-07-19',
    amount: 1650.00,
    category: 'Buchdruck',
    description: 'Magazin-Produktion Quartalsheft',
    client: 'Lifestylemagazin GmbH',
    invoiceNumber: 'INV-2023-012',
    createdAt: '2023-07-19T13:20:00Z',
    updatedAt: '2023-07-19T13:20:00Z',
  },
  // August 2023
  {
    id: '13',
    date: '2023-08-02',
    amount: 3200.00,
    category: 'Großformatdruck',
    description: 'Messesystem mit Grafikdruck',
    client: 'Industriemesse GmbH',
    invoiceNumber: 'INV-2023-013',
    createdAt: '2023-08-02T10:30:00Z',
    updatedAt: '2023-08-02T10:30:00Z',
  },
  {
    id: '14',
    date: '2023-08-24',
    amount: 890.00,
    category: 'Druckaufträge',
    description: 'Kalender und Notizbücher',
    client: 'Bürobedarf Schneider KG',
    invoiceNumber: 'INV-2023-014',
    createdAt: '2023-08-24T15:10:00Z',
    updatedAt: '2023-08-24T15:10:00Z',
  },
  // September 2023
  {
    id: '15',
    date: '2023-09-07',
    amount: 1380.00,
    category: 'Siebdruck',
    description: 'Firmen-Textilkollektion',
    client: 'Bau & Service GmbH',
    invoiceNumber: 'INV-2023-015',
    createdAt: '2023-09-07T11:45:00Z',
    updatedAt: '2023-09-07T11:45:00Z',
  },
  {
    id: '16',
    date: '2023-09-19',
    amount: 2750.00,
    category: 'Digitaldruck',
    description: 'Produktetiketten mit Spezialfolie',
    client: 'Gourmet Deluxe GmbH',
    invoiceNumber: 'INV-2023-016',
    createdAt: '2023-09-19T14:00:00Z',
    updatedAt: '2023-09-19T14:00:00Z',
  },
  // Oktober 2023
  {
    id: '17',
    date: '2023-10-04',
    amount: 4100.00,
    category: 'Druckaufträge',
    description: 'Imagebroschüre mit Veredelung',
    client: 'Immobiliengruppe Hauser AG',
    invoiceNumber: 'INV-2023-017',
    createdAt: '2023-10-04T10:15:00Z',
    updatedAt: '2023-10-04T10:15:00Z',
  },
  {
    id: '18',
    date: '2023-10-26',
    amount: 1920.00,
    category: 'Großformatdruck',
    description: 'Schaufensterbeklebung',
    client: 'Modehaus Eleganza GmbH',
    invoiceNumber: 'INV-2023-018',
    createdAt: '2023-10-26T13:30:00Z',
    updatedAt: '2023-10-26T13:30:00Z',
  },
  // November 2023
  {
    id: '19',
    date: '2023-11-09',
    amount: 3300.00,
    category: 'Buchdruck',
    description: 'Kalenderproduktion für kommendes Jahr',
    client: 'Verlagsgruppe Schmidt GmbH',
    invoiceNumber: 'INV-2023-019',
    createdAt: '2023-11-09T09:30:00Z',
    updatedAt: '2023-11-09T09:30:00Z',
  },
  {
    id: '20',
    date: '2023-11-21',
    amount: 2450.00,
    category: 'Druckaufträge',
    description: 'Weihnachtskarten und Firmengeschenke',
    client: 'Consulting Partner GmbH',
    invoiceNumber: 'INV-2023-020',
    createdAt: '2023-11-21T11:00:00Z',
    updatedAt: '2023-11-21T11:00:00Z',
  },
  // Dezember 2023
  {
    id: '21',
    date: '2023-12-05',
    amount: 3800.00,
    category: 'Digitaldruck',
    description: 'Personalisierte Weihnachtsmailings',
    client: 'Versicherungsmakler Meyer & Co',
    invoiceNumber: 'INV-2023-021',
    createdAt: '2023-12-05T10:45:00Z',
    updatedAt: '2023-12-05T10:45:00Z',
  },
  {
    id: '22',
    date: '2023-12-18',
    amount: 2100.00,
    category: 'Siebdruck',
    description: 'Werbemittel für Jahresevent',
    client: 'Eventmanagement Total GmbH',
    invoiceNumber: 'INV-2023-022',
    createdAt: '2023-12-18T13:15:00Z',
    updatedAt: '2023-12-18T13:15:00Z',
  },
  // Januar 2024
  {
    id: '23',
    date: '2024-01-10',
    amount: 3200.00,
    category: 'Druckaufträge',
    description: 'Geschäftsausstattung Komplett',
    client: 'Neugründung Technik GmbH',
    invoiceNumber: 'INV-2024-001',
    createdAt: '2024-01-10T09:30:00Z',
    updatedAt: '2024-01-10T09:30:00Z',
  },
  {
    id: '24',
    date: '2024-01-24',
    amount: 1750.00,
    category: 'Großformatdruck',
    description: 'Messebanner für Branchenmesse',
    client: 'Handwerk & Co. KG',
    invoiceNumber: 'INV-2024-002',
    createdAt: '2024-01-24T14:00:00Z',
    updatedAt: '2024-01-24T14:00:00Z',
  },
  // Februar 2024
  {
    id: '25',
    date: '2024-02-07',
    amount: 1950.00,
    category: 'Digitaldruck',
    description: 'Kundenzeitschrift Quartalsheft',
    client: 'Stadtwerke GmbH',
    invoiceNumber: 'INV-2024-003',
    createdAt: '2024-02-07T11:15:00Z',
    updatedAt: '2024-02-07T11:15:00Z',
  },
  {
    id: '26',
    date: '2024-02-20',
    amount: 2800.00,
    category: 'Buchdruck',
    description: 'Jubiläumsband mit Goldprägung',
    client: 'Historischer Verein e.V.',
    invoiceNumber: 'INV-2024-004',
    createdAt: '2024-02-20T10:30:00Z',
    updatedAt: '2024-02-20T10:30:00Z',
  },
  // März 2024
  {
    id: '27',
    date: '2024-03-05',
    amount: 3400.00,
    category: 'Druckaufträge',
    description: 'Produktkataloge Frühjahrskollektion',
    client: 'Design Möbel GmbH',
    invoiceNumber: 'INV-2024-005',
    createdAt: '2024-03-05T09:45:00Z',
    updatedAt: '2024-03-05T09:45:00Z',
  },
  {
    id: '28',
    date: '2024-03-18',
    amount: 1250.00,
    category: 'Siebdruck',
    description: 'Teamausstattung für Sportverein',
    client: 'FC Adler e.V.',
    invoiceNumber: 'INV-2024-006',
    createdAt: '2024-03-18T13:30:00Z',
    updatedAt: '2024-03-18T13:30:00Z',
  }
];

const mockExpenseData: Expense[] = [
  // März 2023
  {
    id: '1',
    date: '2023-03-05',
    amount: 1450.00,
    category: 'Büromiete',
    description: 'Monatsmiete März',
    vendor: 'Immobilien Verwaltung GmbH',
    taxDeductible: true,
    createdAt: '2023-03-05T08:00:00Z',
    updatedAt: '2023-03-05T08:00:00Z',
  },
  {
    id: '2',
    date: '2023-03-12',
    amount: 720.00,
    category: 'Druckmaterial',
    description: 'Toner und Spezialpapier',
    vendor: 'Print Supply Store',
    receiptNumber: 'R-2023-001',
    taxDeductible: true,
    createdAt: '2023-03-12T11:45:00Z',
    updatedAt: '2023-03-12T11:45:00Z',
  },
  {
    id: '3',
    date: '2023-03-18',
    amount: 180.00,
    category: 'Versicherungen',
    description: 'Betriebshaftpflicht Quartalsbeitrag',
    vendor: 'AllSecure Versicherungen',
    receiptNumber: 'R-2023-003',
    taxDeductible: true,
    createdAt: '2023-03-18T14:30:00Z',
    updatedAt: '2023-03-18T14:30:00Z',
  },
  // Zusätzliche Einträge für März 2023
  {
    id: '201',
    date: '2023-03-02',
    amount: 85.00,
    category: 'Druckmaterial',
    description: 'Spezialpapier Premium',
    vendor: 'Paper Wholesale GmbH',
    receiptNumber: 'R-2023-201',
    taxDeductible: true,
    createdAt: '2023-03-02T10:15:00Z',
    updatedAt: '2023-03-02T10:15:00Z',
  },
  {
    id: '202',
    date: '2023-03-04',
    amount: 120.00,
    category: 'Büromaterial',
    description: 'Schreibwaren und Organisationsmaterial',
    vendor: 'Office Center GmbH',
    receiptNumber: 'R-2023-202',
    taxDeductible: true,
    createdAt: '2023-03-04T13:30:00Z',
    updatedAt: '2023-03-04T13:30:00Z',
  },
  {
    id: '203',
    date: '2023-03-07',
    amount: 45.00,
    category: 'Marketing',
    description: 'Social Media Werbung',
    vendor: 'Online Marketing Pro',
    receiptNumber: 'R-2023-203',
    taxDeductible: true,
    createdAt: '2023-03-07T09:00:00Z',
    updatedAt: '2023-03-07T09:00:00Z',
  },
  {
    id: '204',
    date: '2023-03-11',
    amount: 65.00,
    category: 'Infrastruktur',
    description: 'Hosting & Domain-Gebühren',
    vendor: 'Web Services Pro',
    receiptNumber: 'R-2023-204',
    taxDeductible: true,
    createdAt: '2023-03-11T11:30:00Z',
    updatedAt: '2023-03-11T11:30:00Z',
  },
  {
    id: '205',
    date: '2023-03-15',
    amount: 320.00,
    category: 'Druckmaterial',
    description: 'Spezialfarben für Siebdruck',
    vendor: 'ColorExpert GmbH',
    receiptNumber: 'R-2023-205',
    taxDeductible: true,
    createdAt: '2023-03-15T14:45:00Z',
    updatedAt: '2023-03-15T14:45:00Z',
  },
  {
    id: '206',
    date: '2023-03-20',
    amount: 250.00,
    category: 'Maschinenwartung',
    description: 'Kleinere Reparatur Digitaldrucker',
    vendor: 'PrintTech Service GmbH',
    receiptNumber: 'R-2023-206',
    taxDeductible: true,
    createdAt: '2023-03-20T10:00:00Z',
    updatedAt: '2023-03-20T10:00:00Z',
  },
  {
    id: '207',
    date: '2023-03-24',
    amount: 130.00,
    category: 'Büromaterial',
    description: 'Bindegeräte-Zubehör',
    vendor: 'Office Supply Store',
    receiptNumber: 'R-2023-207',
    taxDeductible: true,
    createdAt: '2023-03-24T13:15:00Z',
    updatedAt: '2023-03-24T13:15:00Z',
  },
  {
    id: '208',
    date: '2023-03-28',
    amount: 75.00,
    category: 'Marketing',
    description: 'Branchenbucheintrag',
    vendor: 'Branchenverzeichnis Druck',
    receiptNumber: 'R-2023-208',
    taxDeductible: true,
    createdAt: '2023-03-28T15:45:00Z',
    updatedAt: '2023-03-28T15:45:00Z',
  },
  {
    id: '209',
    date: '2023-03-31',
    amount: 190.00,
    category: 'Betriebskosten',
    description: 'Stromkosten Druckwerkstatt',
    vendor: 'Energieversorger Stadt',
    receiptNumber: 'R-2023-209',
    taxDeductible: true,
    createdAt: '2023-03-31T09:30:00Z',
    updatedAt: '2023-03-31T09:30:00Z',
  },
  // April 2023
  {
    id: '4',
    date: '2023-04-01',
    amount: 1450.00,
    category: 'Büromiete',
    description: 'Monatsmiete April',
    vendor: 'Immobilien Verwaltung GmbH',
    taxDeductible: true,
    createdAt: '2023-04-01T09:00:00Z',
    updatedAt: '2023-04-01T09:00:00Z',
  },
  {
    id: '5',
    date: '2023-04-10',
    amount: 350.00,
    category: 'Maschinenwartung',
    description: 'Wartung Digitaldrucker',
    vendor: 'PrintTech Service GmbH',
    receiptNumber: 'R-2023-004',
    taxDeductible: true,
    createdAt: '2023-04-10T15:20:00Z',
    updatedAt: '2023-04-10T15:20:00Z',
  },
  {
    id: '6',
    date: '2023-04-22',
    amount: 850.00,
    category: 'Druckmaterial',
    description: 'Spezialfarben und Folien',
    vendor: 'ColorExpert GmbH',
    receiptNumber: 'R-2023-005',
    taxDeductible: true,
    createdAt: '2023-04-22T10:15:00Z',
    updatedAt: '2023-04-22T10:15:00Z',
  },
  // Zusätzliche Einträge für April 2023
  {
    id: '210',
    date: '2023-04-03',
    amount: 95.00,
    category: 'Druckmaterial',
    description: 'Verpackungsmaterial für Versand',
    vendor: 'Verpackung Großhandel',
    receiptNumber: 'R-2023-210',
    taxDeductible: true,
    createdAt: '2023-04-03T11:00:00Z',
    updatedAt: '2023-04-03T11:00:00Z',
  },
  {
    id: '211',
    date: '2023-04-05',
    amount: 180.00,
    category: 'Fortbildung',
    description: 'Online-Kurs neue Drucktechniken',
    vendor: 'Digital Learning Academy',
    receiptNumber: 'R-2023-211',
    taxDeductible: true,
    createdAt: '2023-04-05T14:30:00Z',
    updatedAt: '2023-04-05T14:30:00Z',
  },
  {
    id: '212',
    date: '2023-04-08',
    amount: 140.00,
    category: 'Betriebskosten',
    description: 'Telefonkosten & Internet',
    vendor: 'Telekom Business',
    receiptNumber: 'R-2023-212',
    taxDeductible: true,
    createdAt: '2023-04-08T09:15:00Z',
    updatedAt: '2023-04-08T09:15:00Z',
  },
  {
    id: '213',
    date: '2023-04-12',
    amount: 75.00,
    category: 'Marketing',
    description: 'Anzeige Lokalzeitung',
    vendor: 'Stadtanzeiger Verlag',
    receiptNumber: 'R-2023-213',
    taxDeductible: true,
    createdAt: '2023-04-12T13:45:00Z',
    updatedAt: '2023-04-12T13:45:00Z',
  },
  {
    id: '214',
    date: '2023-04-15',
    amount: 290.00,
    category: 'Druckmaterial',
    description: 'Spezialfolien für Großformatdruck',
    vendor: 'Print Supply Store',
    receiptNumber: 'R-2023-214',
    taxDeductible: true,
    createdAt: '2023-04-15T10:30:00Z',
    updatedAt: '2023-04-15T10:30:00Z',
  },
  {
    id: '215',
    date: '2023-04-18',
    amount: 110.00,
    category: 'Versicherungen',
    description: 'Zusatzversicherung Maschinen',
    vendor: 'Gewerbeversicherung Plus',
    receiptNumber: 'R-2023-215',
    taxDeductible: true,
    createdAt: '2023-04-18T15:00:00Z',
    updatedAt: '2023-04-18T15:00:00Z',
  },
  {
    id: '216',
    date: '2023-04-24',
    amount: 220.00,
    category: 'Maschinenwartung',
    description: 'Ersatzteile Bindegerät',
    vendor: 'PrintTech Service GmbH',
    receiptNumber: 'R-2023-216',
    taxDeductible: true,
    createdAt: '2023-04-24T11:15:00Z',
    updatedAt: '2023-04-24T11:15:00Z',
  },
  {
    id: '217',
    date: '2023-04-27',
    amount: 85.00,
    category: 'Büromaterial',
    description: 'Archivierungssystem',
    vendor: 'Office Center GmbH',
    receiptNumber: 'R-2023-217',
    taxDeductible: true,
    createdAt: '2023-04-27T14:45:00Z',
    updatedAt: '2023-04-27T14:45:00Z',
  },
  {
    id: '218',
    date: '2023-04-30',
    amount: 160.00,
    category: 'Betriebskosten',
    description: 'Wasserkosten Druckerei',
    vendor: 'Stadtwerke',
    receiptNumber: 'R-2023-218',
    taxDeductible: true,
    createdAt: '2023-04-30T09:00:00Z',
    updatedAt: '2023-04-30T09:00:00Z',
  },
  // Mai 2023
  {
    id: '7',
    date: '2023-05-01',
    amount: 1450.00,
    category: 'Büromiete',
    description: 'Monatsmiete Mai',
    vendor: 'Immobilien Verwaltung GmbH',
    taxDeductible: true,
    createdAt: '2023-05-01T08:30:00Z',
    updatedAt: '2023-05-01T08:30:00Z',
  },
  {
    id: '8',
    date: '2023-05-14',
    amount: 280.00,
    category: 'Marketing',
    description: 'Online-Werbung Social Media',
    vendor: 'DigiMarketing GmbH',
    receiptNumber: 'R-2023-006',
    taxDeductible: true,
    createdAt: '2023-05-14T13:45:00Z',
    updatedAt: '2023-05-14T13:45:00Z',
  },
  // Juni 2023
  {
    id: '9',
    date: '2023-06-01',
    amount: 1450.00,
    category: 'Büromiete',
    description: 'Monatsmiete Juni',
    vendor: 'Immobilien Verwaltung GmbH',
    taxDeductible: true,
    createdAt: '2023-06-01T09:00:00Z',
    updatedAt: '2023-06-01T09:00:00Z',
  },
  {
    id: '10',
    date: '2023-06-12',
    amount: 980.00,
    category: 'Druckmaterial',
    description: 'Großbestellung Papier und Bindungen',
    vendor: 'Paper Wholesale GmbH',
    receiptNumber: 'R-2023-007',
    taxDeductible: true,
    createdAt: '2023-06-12T11:30:00Z',
    updatedAt: '2023-06-12T11:30:00Z',
  },
  {
    id: '11',
    date: '2023-06-25',
    amount: 450.00,
    category: 'Fortbildung',
    description: 'Seminar Druck-Innovationen',
    vendor: 'Print Academy e.V.',
    receiptNumber: 'R-2023-008',
    taxDeductible: true,
    createdAt: '2023-06-25T14:00:00Z',
    updatedAt: '2023-06-25T14:00:00Z',
  },
  // Juli 2023
  {
    id: '12',
    date: '2023-07-01',
    amount: 1450.00,
    category: 'Büromiete',
    description: 'Monatsmiete Juli',
    vendor: 'Immobilien Verwaltung GmbH',
    taxDeductible: true,
    createdAt: '2023-07-01T08:45:00Z',
    updatedAt: '2023-07-01T08:45:00Z',
  },
  {
    id: '13',
    date: '2023-07-18',
    amount: 380.00,
    category: 'Maschinenwartung',
    description: 'Inspektion Großformatdrucker',
    vendor: 'PrintTech Service GmbH',
    receiptNumber: 'R-2023-009',
    taxDeductible: true,
    createdAt: '2023-07-18T10:30:00Z',
    updatedAt: '2023-07-18T10:30:00Z',
  },
  // August 2023
  {
    id: '14',
    date: '2023-08-01',
    amount: 1450.00,
    category: 'Büromiete',
    description: 'Monatsmiete August',
    vendor: 'Immobilien Verwaltung GmbH',
    taxDeductible: true,
    createdAt: '2023-08-01T09:15:00Z',
    updatedAt: '2023-08-01T09:15:00Z',
  },
  {
    id: '15',
    date: '2023-08-15',
    amount: 650.00,
    category: 'Druckmaterial',
    description: 'Spezialfarben und Lacke',
    vendor: 'ColorExpert GmbH',
    receiptNumber: 'R-2023-010',
    taxDeductible: true,
    createdAt: '2023-08-15T13:00:00Z',
    updatedAt: '2023-08-15T13:00:00Z',
  },
  {
    id: '16',
    date: '2023-08-28',
    amount: 320.00,
    category: 'Marketing',
    description: 'Lokalzeitung Anzeige',
    vendor: 'Stadtanzeiger Verlag',
    receiptNumber: 'R-2023-011',
    taxDeductible: true,
    createdAt: '2023-08-28T11:45:00Z',
    updatedAt: '2023-08-28T11:45:00Z',
  },
  // September 2023
  {
    id: '17',
    date: '2023-09-01',
    amount: 1450.00,
    category: 'Büromiete',
    description: 'Monatsmiete September',
    vendor: 'Immobilien Verwaltung GmbH',
    taxDeductible: true,
    createdAt: '2023-09-01T08:30:00Z',
    updatedAt: '2023-09-01T08:30:00Z',
  },
  {
    id: '18',
    date: '2023-09-14',
    amount: 180.00,
    category: 'Versicherungen',
    description: 'Betriebshaftpflicht Quartalsbeitrag',
    vendor: 'AllSecure Versicherungen',
    receiptNumber: 'R-2023-012',
    taxDeductible: true,
    createdAt: '2023-09-14T10:00:00Z',
    updatedAt: '2023-09-14T10:00:00Z',
  },
  // Oktober 2023
  {
    id: '19',
    date: '2023-10-01',
    amount: 1450.00,
    category: 'Büromiete',
    description: 'Monatsmiete Oktober',
    vendor: 'Immobilien Verwaltung GmbH',
    taxDeductible: true,
    createdAt: '2023-10-01T09:00:00Z',
    updatedAt: '2023-10-01T09:00:00Z',
  },
  {
    id: '20',
    date: '2023-10-12',
    amount: 790.00,
    category: 'Druckmaterial',
    description: 'Papiervorrat Aufstockung',
    vendor: 'Paper Wholesale GmbH',
    receiptNumber: 'R-2023-013',
    taxDeductible: true,
    createdAt: '2023-10-12T14:15:00Z',
    updatedAt: '2023-10-12T14:15:00Z',
  },
  {
    id: '21',
    date: '2023-10-25',
    amount: 420.00,
    category: 'Maschinenwartung',
    description: 'Reparatur Buchbindegerät',
    vendor: 'PrintTech Service GmbH',
    receiptNumber: 'R-2023-014',
    taxDeductible: true,
    createdAt: '2023-10-25T11:30:00Z',
    updatedAt: '2023-10-25T11:30:00Z',
  },
  // November 2023
  {
    id: '22',
    date: '2023-11-01',
    amount: 1450.00,
    category: 'Büromiete',
    description: 'Monatsmiete November',
    vendor: 'Immobilien Verwaltung GmbH',
    taxDeductible: true,
    createdAt: '2023-11-01T08:45:00Z',
    updatedAt: '2023-11-01T08:45:00Z',
  },
  {
    id: '23',
    date: '2023-11-15',
    amount: 560.00,
    category: 'Marketing',
    description: 'Weihnachtsaktion Flyer',
    vendor: 'DigiMarketing GmbH',
    receiptNumber: 'R-2023-015',
    taxDeductible: true,
    createdAt: '2023-11-15T13:30:00Z',
    updatedAt: '2023-11-15T13:30:00Z',
  },
  // Dezember 2023
  {
    id: '24',
    date: '2023-12-01',
    amount: 1450.00,
    category: 'Büromiete',
    description: 'Monatsmiete Dezember',
    vendor: 'Immobilien Verwaltung GmbH',
    taxDeductible: true,
    createdAt: '2023-12-01T09:15:00Z',
    updatedAt: '2023-12-01T09:15:00Z',
  },
  {
    id: '25',
    date: '2023-12-10',
    amount: 850.00,
    category: 'Druckmaterial',
    description: 'Spezialprodukte für Weihnachtsaufträge',
    vendor: 'Print Supply Store',
    receiptNumber: 'R-2023-016',
    taxDeductible: true,
    createdAt: '2023-12-10T11:00:00Z',
    updatedAt: '2023-12-10T11:00:00Z',
  },
  {
    id: '26',
    date: '2023-12-15',
    amount: 180.00,
    category: 'Versicherungen',
    description: 'Betriebshaftpflicht Quartalsbeitrag',
    vendor: 'AllSecure Versicherungen',
    receiptNumber: 'R-2023-017',
    taxDeductible: true,
    createdAt: '2023-12-15T14:30:00Z',
    updatedAt: '2023-12-15T14:30:00Z',
  },
  // Januar 2024
  {
    id: '27',
    date: '2024-01-01',
    amount: 1550.00,
    category: 'Büromiete',
    description: 'Monatsmiete Januar (Erhöhung)',
    vendor: 'Immobilien Verwaltung GmbH',
    taxDeductible: true,
    createdAt: '2024-01-01T08:30:00Z',
    updatedAt: '2024-01-01T08:30:00Z',
  },
  {
    id: '28',
    date: '2024-01-18',
    amount: 1250.00,
    category: 'Maschinenwartung',
    description: 'Jahreswartung aller Druckmaschinen',
    vendor: 'PrintTech Service GmbH',
    receiptNumber: 'R-2024-001',
    taxDeductible: true,
    createdAt: '2024-01-18T10:45:00Z',
    updatedAt: '2024-01-18T10:45:00Z',
  },
  // Februar 2024
  {
    id: '29',
    date: '2024-02-01',
    amount: 1550.00,
    category: 'Büromiete',
    description: 'Monatsmiete Februar',
    vendor: 'Immobilien Verwaltung GmbH',
    taxDeductible: true,
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-01T09:00:00Z',
  },
  {
    id: '30',
    date: '2024-02-12',
    amount: 680.00,
    category: 'Druckmaterial',
    description: 'Farben und Spezialmedien',
    vendor: 'ColorExpert GmbH',
    receiptNumber: 'R-2024-002',
    taxDeductible: true,
    createdAt: '2024-02-12T13:15:00Z',
    updatedAt: '2024-02-12T13:15:00Z',
  },
  {
    id: '31',
    date: '2024-02-22',
    amount: 490.00,
    category: 'Fortbildung',
    description: 'Fachkonferenz Drucktechnologien',
    vendor: 'Print Academy e.V.',
    receiptNumber: 'R-2024-003',
    taxDeductible: true,
    createdAt: '2024-02-22T11:30:00Z',
    updatedAt: '2024-02-22T11:30:00Z',
  },
  // März 2024
  {
    id: '32',
    date: '2024-03-01',
    amount: 1550.00,
    category: 'Büromiete',
    description: 'Monatsmiete März',
    vendor: 'Immobilien Verwaltung GmbH',
    taxDeductible: true,
    createdAt: '2024-03-01T08:45:00Z',
    updatedAt: '2024-03-01T08:45:00Z',
  },
  {
    id: '33',
    date: '2024-03-15',
    amount: 180.00,
    category: 'Versicherungen',
    description: 'Betriebshaftpflicht Quartalsbeitrag',
    vendor: 'AllSecure Versicherungen',
    receiptNumber: 'R-2024-004',
    taxDeductible: true,
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
  },
  {
    id: '34',
    date: '2024-03-22',
    amount: 750.00,
    category: 'Druckmaterial',
    description: 'Papier und Verbrauchsmaterialien',
    vendor: 'Paper Wholesale GmbH',
    receiptNumber: 'R-2024-005',
    taxDeductible: true,
    createdAt: '2024-03-22T14:30:00Z',
    updatedAt: '2024-03-22T14:30:00Z',
  }
];

const ReportsPage = () => {
  const [income, setIncome] = useState<Income[]>(mockIncomeData);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenseData);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [periodFilter, setPeriodFilter] = useState<string>('all');
  const [expandedMonths, setExpandedMonths] = useState<string[]>([]);
  const [categoryData, setCategoryData] = useState<{
    incomeByCategory: Record<string, number>;
    expensesByCategory: Record<string, number>;
  }>({
    incomeByCategory: {},
    expensesByCategory: {},
  });

  useEffect(() => {
    // Calculate filtered data based on period filter
    let filteredIncome = [...income];
    let filteredExpenses = [...expenses];
    
    // Verwende konstante Daten für die Filter statt des aktuellen Datums
    // Damit werden immer Daten angezeigt, auch wenn das aktuelle Datum kein Match hat
    const simulatedCurrentYear = 2024;
    const simulatedCurrentMonth = 2; // März (0-basiert)
    
    if (periodFilter === 'thisMonth') {
      filteredIncome = income.filter((item) => {
        const date = new Date(item.date);
        return date.getFullYear() === simulatedCurrentYear && date.getMonth() === simulatedCurrentMonth;
      });
      
      filteredExpenses = expenses.filter((item) => {
        const date = new Date(item.date);
        return date.getFullYear() === simulatedCurrentYear && date.getMonth() === simulatedCurrentMonth;
      });
    } else if (periodFilter === 'thisYear') {
      filteredIncome = income.filter((item) => {
        const date = new Date(item.date);
        return date.getFullYear() === simulatedCurrentYear;
      });
      
      filteredExpenses = expenses.filter((item) => {
        const date = new Date(item.date);
        return date.getFullYear() === simulatedCurrentYear;
      });
    }
    // 'all' doesn't need filtering
    
    // Calculate monthly data
    const monthData: Record<string, MonthlyData> = {};
    
    // Process income
    filteredIncome.forEach((item) => {
      const date = new Date(item.date);
      const year = date.getFullYear();
      const month = date.getMonth();
      
      const key = `${year}-${month}`;
      if (!monthData[key]) {
        const monthName = format(date, 'MMMM', { locale: de }) as any;
        monthData[key] = {
          month: monthName,
          year,
          totalIncome: 0,
          totalExpenses: 0,
          balance: 0,
        };
      }
      
      monthData[key].totalIncome += item.amount;
      monthData[key].balance += item.amount;
    });
    
    // Process expenses
    filteredExpenses.forEach((item) => {
      const date = new Date(item.date);
      const year = date.getFullYear();
      const month = date.getMonth();
      
      const key = `${year}-${month}`;
      if (!monthData[key]) {
        const monthName = format(date, 'MMMM', { locale: de }) as any;
        monthData[key] = {
          month: monthName,
          year,
          totalIncome: 0,
          totalExpenses: 0,
          balance: 0,
        };
      }
      
      monthData[key].totalExpenses += item.amount;
      monthData[key].balance -= item.amount;
    });
    
    // Convert to array and sort by date
    const monthlyDataArray = Object.values(monthData).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return getMonthNumber(b.month) - getMonthNumber(a.month);
    });
    
    setMonthlyData(monthlyDataArray);
    
    // Calculate category data
    const incomeByCategory: Record<string, number> = {};
    const expensesByCategory: Record<string, number> = {};
    
    filteredIncome.forEach((item) => {
      if (!incomeByCategory[item.category]) {
        incomeByCategory[item.category] = 0;
      }
      incomeByCategory[item.category] += item.amount;
    });
    
    filteredExpenses.forEach((item) => {
      if (!expensesByCategory[item.category]) {
        expensesByCategory[item.category] = 0;
      }
      expensesByCategory[item.category] += item.amount;
    });
    
    setCategoryData({
      incomeByCategory,
      expensesByCategory,
    });
    
  }, [income, expenses, periodFilter]);
  
  const getMonthNumber = (monthName: string): number => {
    const months = [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];
    return months.indexOf(monthName);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };
  
  const getTotalIncome = () => {
    return monthlyData.reduce((sum, month) => sum + month.totalIncome, 0);
  };
  
  const getTotalExpenses = () => {
    return monthlyData.reduce((sum, month) => sum + month.totalExpenses, 0);
  };
  
  const getBalance = () => {
    return getTotalIncome() - getTotalExpenses();
  };
  
  const handleExportToExcel = () => {
    // Verwende die gleichen simulierten Konstanten für die Filterung beim Export
    const simulatedCurrentYear = 2024;
    const simulatedCurrentMonth = 2; // März (0-basiert)
    
    exportFinancialSummaryToExcel(
      periodFilter === 'all' ? income : income.filter((item) => {
        const date = new Date(item.date);
        
        if (periodFilter === 'thisMonth') {
          return date.getFullYear() === simulatedCurrentYear && date.getMonth() === simulatedCurrentMonth;
        } else if (periodFilter === 'thisYear') {
          return date.getFullYear() === simulatedCurrentYear;
        }
        return true;
      }),
      periodFilter === 'all' ? expenses : expenses.filter((item) => {
        const date = new Date(item.date);
        
        if (periodFilter === 'thisMonth') {
          return date.getFullYear() === simulatedCurrentYear && date.getMonth() === simulatedCurrentMonth;
        } else if (periodFilter === 'thisYear') {
          return date.getFullYear() === simulatedCurrentYear;
        }
        return true;
      }),
      {
        fileName: `Finanzübersicht_${periodFilter}_${new Date().toISOString().split('T')[0]}`,
      }
    );
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Finanzberichte</h1>
          <div className="flex items-center space-x-4">
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
            >
              <option value="thisMonth">März 2024</option>
              <option value="thisYear">Jahr 2024</option>
              <option value="all">Gesamter Zeitraum</option>
            </select>
            <button
              onClick={handleExportToExcel}
              className="btn btn-outline flex items-center transition-all duration-300 ease-in-out hover:bg-gray-50 hover:shadow-md hover:scale-105 rounded-md px-4 py-2 border border-gray-300"
            >
              <FiDownload className="mr-2 transition-transform duration-300 group-hover:translate-y-[1px]" />
              Als Excel exportieren
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:translate-y-[-2px]">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                <FiTrendingUp className="text-xl" />
              </div>
              <div>
              <h3 className="text-lg font-medium text-gray-700">Einnahmen</h3>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(getTotalIncome())}</p>
            </div>
            </div>
            <div className="h-1 w-full bg-gray-200 rounded-full mt-2">
              <div 
                className="h-1 bg-green-500 rounded-full" 
                style={{ width: '100%' }}
              ></div>
            </div>
          </div>
          
          <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:translate-y-[-2px]">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-red-100 text-red-500 mr-4">
                <FiTrendingDown className="text-xl" />
              </div>
              <div>
              <h3 className="text-lg font-medium text-gray-700">Ausgaben</h3>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(getTotalExpenses())}</p>
            </div>
            </div>
            <div className="h-1 w-full bg-gray-200 rounded-full mt-2">
              <div 
                className="h-1 bg-red-500 rounded-full" 
                style={{ width: `${(getTotalExpenses() / (getTotalIncome() > 0 ? getTotalIncome() : 1)) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:translate-y-[-2px]">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                <FiBarChart2 className="text-xl" />
            </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">Bilanz</h3>
                <p className={`text-2xl font-bold ${getBalance() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(getBalance())}
            </p>
              </div>
            </div>
            <div className="h-1 w-full bg-gray-200 rounded-full mt-2">
              <div 
                className={`h-1 rounded-full ${getBalance() >= 0 ? 'bg-green-500' : 'bg-red-500'}`} 
                style={{ width: `${Math.min(Math.abs(getBalance()) / (getTotalIncome() > 0 ? getTotalIncome() : 1) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Monthly Overview */}
        <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Monatliche Übersicht</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 rounded-tl-md">
                    Monat
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    Einnahmen
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    Ausgaben
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 rounded-tr-md">
                    Bilanz
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {monthlyData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      Keine Daten vorhanden
                    </td>
                  </tr>
                ) : (
                  monthlyData.map((month, index) => (
                    <React.Fragment key={`${month.year}-${month.month}`}>
                      <tr className="transition-colors duration-200 hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                          <div className="flex items-center">
                            <button 
                              onClick={() => {
                                const monthKey = `${month.year}-${month.month}`;
                                setExpandedMonths(prev => 
                                  prev.includes(monthKey)
                                    ? prev.filter(m => m !== monthKey)
                                    : [...prev, monthKey]
                                );
                              }}
                              className="mr-2 text-gray-400 hover:text-gray-700 transition-colors"
                              aria-label={expandedMonths.includes(`${month.year}-${month.month}`) ? "Collapse" : "Expand"}
                            >
                              {expandedMonths.includes(`${month.year}-${month.month}`) 
                                ? <FiChevronUp className="h-4 w-4" /> 
                                : <FiChevronDown className="h-4 w-4" />}
                            </button>
                        {month.month} {month.year}
                          </div>
                      </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {formatCurrency(month.totalIncome)}
                      </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                        {formatCurrency(month.totalExpenses)}
                      </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${month.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(month.balance)}
                      </td>
                    </tr>
                      {expandedMonths.includes(`${month.year}-${month.month}`) && (
                        <tr>
                          <td colSpan={4} className="px-0">
                            <div className="bg-gray-50 p-4 border-t border-b border-gray-200">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div>
                                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <FiTrendingUp className="mr-1 text-green-500" /> Einnahmen im {month.month} {month.year}
                                  </h3>
                                  <div className="overflow-x-auto bg-white rounded shadow">
                                    <div className="max-h-60 overflow-y-auto">
                                      <table className="min-w-full">
                                        <thead className="bg-gray-50 sticky top-0 z-10">
                                          <tr>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Datum</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Kategorie</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Betrag</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Beschreibung</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                          {income
                                            .filter(item => {
                                              const date = new Date(item.date);
                                              return date.getFullYear() === month.year && 
                                                    date.getMonth() === getMonthNumber(month.month);
                                            })
                                            .map(item => (
                                              <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-3 py-2 text-xs text-gray-700">
                                                  {new Date(item.date).toLocaleDateString('de-DE')}
                                                </td>
                                                <td className="px-3 py-2 text-xs text-gray-700">{item.category}</td>
                                                <td className="px-3 py-2 text-xs font-medium text-green-600">
                                                  {formatCurrency(item.amount)}
                                                </td>
                                                <td className="px-3 py-2 text-xs text-gray-700">
                                                  {item.description.length > 25 
                                                    ? `${item.description.slice(0, 25)}...` 
                                                    : item.description}
                                                </td>
                                              </tr>
                                            ))}
                                          {income.filter(item => {
                                            const date = new Date(item.date);
                                            return date.getFullYear() === month.year && 
                                                  date.getMonth() === getMonthNumber(month.month);
                                          }).length === 0 && (
                                            <tr>
                                              <td colSpan={4} className="px-3 py-2 text-center text-xs text-gray-500">
                                                Keine Einnahmen in diesem Monat
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <FiTrendingDown className="mr-1 text-red-500" /> Ausgaben im {month.month} {month.year}
                                  </h3>
                                  <div className="overflow-x-auto bg-white rounded shadow">
                                    <div className="max-h-60 overflow-y-auto">
                                      <table className="min-w-full">
                                        <thead className="bg-gray-50 sticky top-0 z-10">
                                          <tr>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Datum</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Kategorie</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Betrag</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Beschreibung</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                          {expenses
                                            .filter(item => {
                                              const date = new Date(item.date);
                                              return date.getFullYear() === month.year && 
                                                    date.getMonth() === getMonthNumber(month.month);
                                            })
                                            .map(item => (
                                              <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-3 py-2 text-xs text-gray-700">
                                                  {new Date(item.date).toLocaleDateString('de-DE')}
                                                </td>
                                                <td className="px-3 py-2 text-xs text-gray-700">{item.category}</td>
                                                <td className="px-3 py-2 text-xs font-medium text-red-600">
                                                  {formatCurrency(item.amount)}
                                                </td>
                                                <td className="px-3 py-2 text-xs text-gray-700">
                                                  {item.description.length > 25 
                                                    ? `${item.description.slice(0, 25)}...` 
                                                    : item.description}
                                                </td>
                                              </tr>
                                            ))}
                                          {expenses.filter(item => {
                                            const date = new Date(item.date);
                                            return date.getFullYear() === month.year && 
                                                  date.getMonth() === getMonthNumber(month.month);
                                          }).length === 0 && (
                                            <tr>
                                              <td colSpan={4} className="px-3 py-2 text-center text-xs text-gray-500">
                                                Keine Ausgaben in diesem Monat
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
                <tr className="bg-gray-50 font-bold border-t-2 border-gray-300">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 rounded-bl-md">
                    GESAMT
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    {formatCurrency(getTotalIncome())}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    {formatCurrency(getTotalExpenses())}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getBalance() >= 0 ? 'text-green-600' : 'text-red-600'} rounded-br-md`}>
                    {formatCurrency(getBalance())}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-md bg-green-100 text-green-600 mr-3">
                <FiTrendingUp className="text-lg" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Einnahmen nach Kategorie</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 rounded-tl-md">
                      Kategorie
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                      Betrag
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 rounded-tr-md">
                      % vom Gesamt
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(categoryData.incomeByCategory).length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                        Keine Daten vorhanden
                      </td>
                    </tr>
                  ) : (
                    Object.entries(categoryData.incomeByCategory)
                      .sort(([, a], [, b]) => b - a)
                      .map(([category, amount], index, array) => (
                        <tr key={category} className="transition-colors duration-200 hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                            {category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                            {formatCurrency(amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-800 mr-2">
                            {(amount / getTotalIncome() * 100).toFixed(1)}%
                              </span>
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full" 
                                  style={{ width: `${(amount / getTotalIncome() * 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="card bg-white rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out hover:shadow-lg">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-md bg-red-100 text-red-600 mr-3">
                <FiTrendingDown className="text-lg" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Ausgaben nach Kategorie</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 rounded-tl-md">
                      Kategorie
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                      Betrag
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 rounded-tr-md">
                      % vom Gesamt
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(categoryData.expensesByCategory).length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                        Keine Daten vorhanden
                      </td>
                    </tr>
                  ) : (
                    Object.entries(categoryData.expensesByCategory)
                      .sort(([, a], [, b]) => b - a)
                      .map(([category, amount], index, array) => (
                        <tr key={category} className="transition-colors duration-200 hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                            {category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                            {formatCurrency(amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-800 mr-2">
                            {(amount / getTotalExpenses() * 100).toFixed(1)}%
                              </span>
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-red-500 h-2 rounded-full" 
                                  style={{ width: `${(amount / getTotalExpenses() * 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReportsPage; 