---
title: Goods Vehicles Movement Service (GVMS)
date: 23/06/22
source: https://www.customs4trade.com/blog/what-you-need-to-know-about-goods-vehicle-movement-service-gvms
---

# Goods Vehicles Movement Service (GVMMS)

### Definition

An IT platform available to certain UK ports for quickly getting goods with pre-lodged declarations out of ports and on their way to their final destination.

[List of ports that support GVMS](https://www.gov.uk/guidance/list-of-ports-using-the-goods-vehicle-movement-service)

GVMS is connected to CHIEF and sends electronic shipment status updates to CHIEF.

### Concepts

Declaration - a description of goods that will arrive.
Pre-lodged declaration - a declaration given prior to the departure of goods.

### GVMS

A shipment contains many MRNs (Movement Reference Numbers) for its pre-lodged shipment declarations. 

The MRNs are linked to a single record called a Goods Movement Record(GMR) which also has the truck/tailer license plate.

GMRs can only be used once and by one vehicle.

The haulier only needs to present the GMR to prove that all the goods in the trailer have pre-lodged declarations since the goods are linked to the GMR by their MRNs.


### Digital Offices of Transit

Goods must be presented at the customs Office of Transit at the border when a transit shipment enters a country.

With ports with GVMS, this can be done digitally using the GMR presented at the frontier. The advantage of this is that trucks would not need to physically visit an Office of Transit, they can directly transport the goods to their next destination, saving a lot of time.


### The GVMS flow

1. At the port, GVMS verifies the GMR presented to them.
   - The actual vehicle's registration number must match the vehicle registration number detailed on the GMR.
   - The GMR must be valid
2. When goods board at the EU side, a notification of their pre-lodged import declarations is automatically sent to CHIEF, which are processed while the goods are crossing the channel.
3. Upon embarking the crossing, a vehicle status update of 'EMBARK' is sent to CHIEF
4. Another notification is sent to CHIEF when inbound goods are cleared before they arrive in the UK.


Problems
1. Notification within 30 minutes of embarking that the vehicle must report to customs inspection centre upon arrival and once the goods are manually checked, the GVMs will be updated.

Transit shipments
- transit declaration updated automatically in NCTS on the basis of TAD data entered in GVMS prior to departure from EU.

### Timeframes

From 1 January 2022, GVMS will be in place for all imports and exports at GB port locations which have chosen to use it.

### The user flow

[Developer guide to using the GVMS API](https://developer.service.hmrc.gov.uk/guides/gvms-end-to-end-service-guide/#end-to-end-user-journey)

1. Register for GVMS with HMRC with
   - Government Gateway User ID
   - GB EORI number

API features
- Create a new Goods Movement Record (GMR)
- Update a GMR, for example changing crossing details or adding declaration IDs
- Finalise a GMR
- List their active GMRs
- Get GMR details
- Delete a GMR
- Get GVMS reference data

### GMR

A unique identifier to identify the record containing the following information:

- the direction of the crossing 
- the registration number of the vehicle making the crossing (unless the movement will be unaccompanied) 
- the trailer numbers of all trailers attached to the vehicle 
- details of the planned crossing, if available, including the departure and arrival port, carrier, and departure time 
- whether the vehicle arriving at check-in will accompany the movement on the crossing 
- MRNs for all goods within the vehicle and its trailers that require them
- safety and security declaration references for all goods within the vehicle and its trailers that require them 
- transit declaration references for all goods within the vehicle and its trailers that require them 
- EIDR, ATA, and TIR declaration references

Requirements for obtaining a GMR depends on the nature of the movement, whether it is an import, export or transit.

#### Abbreviations

CHIEF - Customs Handling of Import and Export Freight
GMR - Goods Movement Record
MRN - Movement Reference Number
EIDR (Entry in the Declarant's Records)
ATA (Admission Temporaire or Temporary Admission) Carnet

* temporarily export goods for use outside the UK
* claim relief under temporary admission on goods that you import for temporary use into the UK
* cover transit of goods through certain countries on route to countries where you’ll use them temporarily

TIR (Transports Internationaux Routiers) Carnet
* The TIR procedure is used for transit operations that begin, end, or move through a third (non-EU) country that has signed the TIR convention.