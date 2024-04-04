import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import qs from 'qs';
import { useQuery } from '@tanstack/react-query';
import withQueryProvider from '../../utilities/QueryProvider/QueryProvider';
import useMetastoreDataset from '../../services/useMetastoreDataset';
import useDatastore from '../../services/useDatastore';
import PageNotFound from '../PageNotFound';
import { defaultMetadataMapping } from '../../assets/metadataMapping';
import { Tabs, TabPanel } from '@cmsgov/design-system';
import SearchItemIcon from '../../assets/icons/searchItem';
import DatasetTable from '../../components/DatasetTableTab';
import DatasetOverview from '../../components/DatasetOverviewTab';
import DatasetAPI from '../../components/DatasetAPITab';
import DataDictionary from '../../components/DatasetDataDictionaryTab';
import { DatasetDictionaryItemType, DatasetPageType, DatasetDictionaryType, DistributionType, ResourceType } from '../../types/dataset';
import TransformedDate from '../../components/TransformedDate';
import './dataset.scss';

const getSiteWideDataDictionary = (rootUrl : string, dataDictionaryUrl : string) => {
  const {data, isLoading, error} = useQuery({
    queryKey: ["dictionary"],
    queryFn: () => {
      return fetch(rootUrl + dataDictionaryUrl).then(
        (res) => res.json(),
      )
    }
  });

  return {
    siteWideDataDictionary: data as DatasetDictionaryType,
    dataDictionaryLoading: isLoading
  }
}

const Dataset = ({
  id,
  rootUrl,
  additionalParams,
  customColumns,
  setDatasetTitle,
  customMetadataMapping,
  apiPageUrl = "/api",
  dataDictionaryUrl,
  borderlessTabs = false,
  defaultPageSize = 25
} : DatasetPageType) => {
  const options = location.search
    ? { ...qs.parse(location.search, { ignoreQueryPrefix: true }) }
    : { conditions: [] };

  const { dataset } = useMetastoreDataset(id, rootUrl, additionalParams);
  const title = dataset.title ? dataset.title : '';
  const metadataMapping = {
    ...defaultMetadataMapping,
    ...customMetadataMapping,
  };

  let distribution = {} as DistributionType;
  let distributions= dataset.distribution ? dataset.distribution : [];
  if (distributions.length) {
    distribution = distributions[0];
  }

  const resource = useDatastore(
    '',
    rootUrl,
    {
      ...options,
      limit: defaultPageSize,
      manual: true,
    },
    additionalParams
  ) as ResourceType;

  const { siteWideDataDictionary } = dataDictionaryUrl ? getSiteWideDataDictionary(rootUrl, dataDictionaryUrl) : { siteWideDataDictionary: null};

  // compare schema fields with siteWideDataDictionary to display commonalities for now
  // until dataset level data dictionaries are implemented
  const datasetSitewideDictionary = (siteWideDataDictionary && resource && resource.schema[distribution.identifier]) ?
    siteWideDataDictionary.data.fields.filter((field : DatasetDictionaryItemType) => {
      return Object.keys(resource.schema[distribution.identifier].fields).indexOf(field.name) !== -1;
    }) : null;

  const datasetDictionary = {
      "identifier": "71ec19df-f5ef-5b99-b43b-e566e22670b7",
      "title": "General Payment File Attributes",
      "data": {
          "fields": [
              {
                  "name": "change_type",
                  "title": "Change_Type",
                  "description": "An indicator showing if the payment record is New, Added, Changed, or Unchanged in the current publication compared to the previous publication.\nNEW - To identify \u201cnew\u201d records added from the end of the previous submission deadline until the current submission period deadline date\nADDED - To identify records that were not eligible at the time of previous publication, which is eligible for current publication.\nCHANGED - To identify previously published records modified after the last publication.\nUNCHANGED - To identify previously published records that remain \u201cunchanged\u201d in current publication.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 20
                  }
              },
              {
                  "name": "covered_recipient_type",
                  "title": "Covered_Recipient_Type",
                  "description": "An indicator showing if the recipient of the payment or transfer of value is a physician-covered recipient or non- physician practitioner or a teaching hospital.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 50
                  }
              },
              {
                  "name": "teaching_hospital_ccn",
                  "title": "Teaching_Hospital_CCN",
                  "description": "A unique identifying number (CMS Certification Number) of the Teaching Hospital receiving the payment or other transfer of value.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 6
                  }
              },
              {
                  "name": "teaching_hospital_id",
                  "title": "Teaching_Hospital_ID",
                  "description": "The system generated a unique identifier of the Teaching Hospital receiving the payment or other transfer of value.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 38,
                      "pattern": "^[0-9]+$"
                  }
              },
              {
                  "name": "teaching_hospital_name",
                  "title": "Teaching_Hospital_Name",
                  "description": "The name of the Teaching Hospital receiving the payment or other transfer of value. The name displayed is as listed in CMS teaching hospital list under Hospital name.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "covered_recipient_profile_id",
                  "title": "Covered_Recipient_Profile_ID",
                  "description": "System generated unique identifier for covered recipient physician or covered recipient non-physician practitioner profile receiving the payment or other transfer of value.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 38,
                      "pattern": "^[0-9]+$"
                  }
              },
              {
                  "name": "covered_recipient_npi",
                  "title": "Covered_Recipient_NPI",
                  "description": "National Provider Identifier is a unique identification number for covered recipient physician or covered recipient non- physician practitioner (and not the NPI of a group the physician\/non-physician practitioner belongs to).",
                  "type": "integer",
                  "constraints": {
                      "maximum": 9999999999
                  }
              },
              {
                  "name": "covered_recipient_first_name",
                  "title": "Covered_Recipient_First_Name",
                  "description": "First name of the covered recipient physician or covered recipient non-physician practitioner receiving the payment or transfer of value, as reported by the submitting entity.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 20
                  }
              },
              {
                  "name": "covered_recipient_middle_name",
                  "title": "Covered_Recipient_Middle_Name",
                  "description": "Middle name of the covered recipient physician or covered recipient non-physician practitioner receiving the payment or transfer of value, as reported by the submitting entity.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 20
                  }
              },
              {
                  "name": "covered_recipient_last_name",
                  "title": "Covered_Recipient_Last_Name",
                  "description": "Last name of the covered recipient physician or covered recipient non-physician practitioner receiving the payment or transfer of value, as reported by the submitting entity.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 35
                  }
              },
              {
                  "name": "covered_recipient_name_suffix",
                  "title": "Covered_Recipient_Name_Suffix",
                  "description": "Name suffix of the covered recipient physician or covered recipient non-physician practitioner receiving the payment or transfer of value, as reported by the submitting entity.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 5
                  }
              },
              {
                  "name": "recipient_primary_business_street_address_line1",
                  "title": "Recipient_Primary_Business_Street_Address_Line1",
                  "description": "The first line of the primary practice\/business street address of the physician or teaching hospital (covered recipient) receiving the payment or other transfer of value.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 55
                  }
              },
              {
                  "name": "recipient_primary_business_street_address_line2",
                  "title": "Recipient_Primary_Business_Street_Address_Line2",
                  "description": "The second line of the primary practice\/business street address of the physician or teaching hospital (covered recipient) receiving the payment or other transfer of value.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 55
                  }
              },
              {
                  "name": "recipient_city",
                  "title": "Recipient_City",
                  "description": "The primary practice\/business city of the physician or teaching hospital (covered recipient) receiving the payment or other transfer of value.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 40
                  }
              },
              {
                  "name": "recipient_state",
                  "title": "Recipient_State",
                  "description": "The primary practice\/business state or territory abbreviation of the physician or teaching hospital (covered recipient) receiving the payment or transfer of value, if the primary practice\/business address is in United States.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 2
                  }
              },
              {
                  "name": "recipient_zip_code",
                  "title": "Recipient_Zip_Code",
                  "description": "The 9-digit zip code for the primary practice\/business location of the physician or teaching hospital (covered recipient) receiving the payment or transfer of value.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 10,
                      "pattern": "\\d{5}(-\\d{4})?"
                  }
              },
              {
                  "name": "recipient_country",
                  "title": "Recipient_Country",
                  "description": "The primary practice\/business address country name of the physician or teaching hospital (covered recipient) receiving the payment or transfer of value.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "recipient_province",
                  "title": "Recipient_Province",
                  "description": "The primary practice\/business province name of the physician (covered recipient) receiving the payment or other transfer of value, if the primary practice\/business address is outside the United States, and if applicable.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 20
                  }
              },
              {
                  "name": "recipient_postal_code",
                  "title": "Recipient_Postal_Code",
                  "description": "The international postal code for the primary practice\/business location of the physician (covered recipient) receiving the payment or other transfer of value, if the primary practice\/business address is outside the United States",
                  "type": "string",
                  "constraints": {
                      "maxLength": 20
                  }
              },
              {
                  "name": "covered_recipient_primary_type_1",
                  "title": "Covered_Recipient_Primary_Type_1",
                  "description": "Primary type of medicine practiced by the physician or Non- Physician Practitioner (covered recipient).",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "covered_recipient_primary_type_2",
                  "title": "Covered_Recipient_Primary_Type_2",
                  "description": "Primary type of medicine practiced by the physician or Non- Physician Practitioner (covered recipient).\nNote: OP began accepting this field in PY2021.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "covered_recipient_primary_type_3",
                  "title": "Covered_Recipient_Primary_Type_3",
                  "description": "Primary type of medicine practiced by the physician or Non- Physician Practitioner (covered recipient).\nNote: OP began accepting this field in PY2021.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "covered_recipient_primary_type_4",
                  "title": "Covered_Recipient_Primary_Type_4",
                  "description": "Primary type of medicine practiced by the physician or Non- Physician Practitioner (covered recipient).\nNote: OP began accepting this field in PY2021.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "covered_recipient_primary_type_5",
                  "title": "Covered_Recipient_Primary_Type_5",
                  "description": "Primary type of medicine practiced by the physician or Non- Physician Practitioner (covered recipient).\nNote: OP began accepting this field in PY2021.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "covered_recipient_primary_type_6",
                  "title": "Covered_Recipient_Primary_Type_6",
                  "description": "Primary type of medicine practiced by the physician or Non- Physician Practitioner (covered recipient).\nNote: OP began accepting this field in PY2021.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "covered_recipient_specialty_1",
                  "title": "Covered_Recipient_Specialty_1",
                  "description": "Physician's or non-physician practitioner\u2019s specialty chosen from the standardized \"provider taxonomy\" code list.\nNote: OP began accepting this field in PY2021.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 300
                  }
              },
              {
                  "name": "covered_recipient_specialty_2",
                  "title": "Covered_Recipient_Specialty_2",
                  "description": "Physician's or non-physician practitioner\u2019s specialty chosen from the standardized \"provider taxonomy\" code list.\nNote: OP began accepting this field in PY2021.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 300
                  }
              },
              {
                  "name": "covered_recipient_specialty_3",
                  "title": "Covered_Recipient_Specialty_3",
                  "description": "Physician's or non-physician practitioner\u2019s specialty chosen from the standardized \"provider taxonomy\" code list.\nNote: OP began accepting this field in PY2021.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 300
                  }
              },
              {
                  "name": "covered_recipient_specialty_4",
                  "title": "Covered_Recipient_Specialty_4",
                  "description": "Physician's or non-physician practitioner\u2019s specialty chosen from the standardized \"provider taxonomy\" code list.\nNote: OP began accepting this field in PY2021.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 300
                  }
              },
              {
                  "name": "covered_recipient_specialty_5",
                  "title": "Covered_Recipient_Specialty_5",
                  "description": "Physician's or non-physician practitioner\u2019s specialty chosen from the standardized \"provider taxonomy\" code list.\nNote: OP began accepting this field in PY2021.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 300
                  }
              },
              {
                  "name": "covered_recipient_specialty_6",
                  "title": "Covered_Recipient_Specialty_6",
                  "description": "Physician's or non-physician practitioner\u2019s specialty chosen from the standardized \"provider taxonomy\" code list.\nNote: OP began accepting this field in PY2021.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 300
                  }
              },
              {
                  "name": "covered_recipient_license_state_code1",
                  "title": "Covered_Recipient_License_State_code1",
                  "description": "The state license number of the covered recipient physician or covered recipient non-physician practitioner, which is a 2- letter state abbreviation; the record may include up to 5 license states, if a physician is licensed in multiple states.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 2
                  }
              },
              {
                  "name": "covered_recipient_license_state_code2",
                  "title": "Covered_Recipient_License_State_code2",
                  "description": "The state license number of the covered recipient physician or covered recipient non-physician practitioner, which is a 2- letter state abbreviation; the record may include up to 5 license states, if a physician is licensed in multiple states.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 2
                  }
              },
              {
                  "name": "covered_recipient_license_state_code3",
                  "title": "Covered_Recipient_License_State_code3",
                  "description": "The state license number of the covered recipient physician or covered recipient non-physician practitioner, which is a 2- letter state abbreviation; the record may include up to 5 license states, if a physician is licensed in multiple states.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 2
                  }
              },
              {
                  "name": "covered_recipient_license_state_code4",
                  "title": "Covered_Recipient_License_State_code4",
                  "description": "The state license number of the covered recipient physician or covered recipient non-physician practitioner, which is a 2- letter state abbreviation; the record may include up to 5 license states, if a physician is licensed in multiple states.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 2
                  }
              },
              {
                  "name": "covered_recipient_license_state_code5",
                  "title": "Covered_Recipient_License_State_code5",
                  "description": "The state license number of the covered recipient physician or covered recipient non-physician practitioner, which is a 2- letter state abbreviation; the record may include up to 5 license states, if a physician is licensed in multiple states.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 2
                  }
              },
              {
                  "name": "submitting_applicable_manufacturer_or_applicable_gpo_name",
                  "title": "Submitting_Applicable_Manufacturer_or_Applicable_GPO_Name",
                  "description": "The textual proper name of the submitting applicable manufacturer or submitting applicable GPO.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "applicable_manufacturer_or_applicable_gpo_making_payment_id",
                  "title": "Applicable_Manufacturer_or_Applicable_GPO_Making_Payment_ID",
                  "description": "System generated unique identifier of the Applicable Manufacturer or Applicable Group Purchasing Organization (GPO) Making a payment or other transfer of value",
                  "type": "string",
                  "constraints": {
                      "maxLength": 38,
                      "pattern": "^[0-9]+$"
                  }
              },
              {
                  "name": "applicable_manufacturer_or_applicable_gpo_making_payment_name",
                  "title": "Applicable_Manufacturer_or_Applicable_GPO_Making_Payment_Name",
                  "description": "The textual proper name of the applicable manufacturer or applicable GPO making the payment or other transfer of value",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "applicable_manufacturer_or_applicable_gpo_making_payment_state",
                  "title": "Applicable_Manufacturer_or_Applicable_GPO_Making_Payment_State",
                  "description": "State name of the submitting applicable manufacturer or submitting applicable GPO as provided in Open  Payments",
                  "type": "string",
                  "constraints": {
                      "maxLength": 2
                  }
              },
              {
                  "name": "applicable_manufacturer_or_applicable_gpo_making_payment_country",
                  "title": "Applicable_Manufacturer_or_Applicable_GPO_Making_Payment_Country",
                  "description": "Country name of the Submitting Applicable Manufacturer or Submitting Applicable Group Purchasing Organization (GPO) as provided in Open Payments",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "total_amount_of_payment_usdollars",
                  "title": "Total_Amount_of_Payment_USDollars",
                  "description": "U.S. dollar amount of payment or other transfer of value to the recipient (manufacturer must convert to dollar currency if necessary)",
                  "type": "number",
                  "constraints": {
                      "maximum": 999999999999.99
                  }
              },
              {
                  "name": "date_of_payment",
                  "title": "Date_of_Payment",
                  "description": "If a singular payment, then this is the actual date the payment was issued; if a series of payments or an aggregated set of payments, this is the date of the first payment to the covered recipient in this program year",
                  "type": "date",
                  "format": "%m\/%d\/%Y"
              },
              {
                  "name": "number_of_payments_included_in_total_amount",
                  "title": "Number_of_Payments_Included_in_Total_Amount",
                  "description": "The number of discrete payments being reported in the \"Total Amount of Payment\".",
                  "type": "integer",
                  "constraints": {
                      "maximum": 999
                  }
              },
              {
                  "name": "form_of_payment_or_transfer_of_value",
                  "title": "Form_of_Payment_or_Transfer_of_Value",
                  "description": "The method of payment used to pay the covered recipient or to make the transfer of value.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "nature_of_payment_or_transfer_of_value",
                  "title": "Nature_of_Payment_or_Transfer_of_Value",
                  "description": "The nature of payment used to pay the covered recipient or to make the transfer of value.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 200
                  }
              },
              {
                  "name": "city_of_travel",
                  "title": "City_of_Travel",
                  "description": "For \"Travel and Lodging\" payments, destination city where covered recipient traveled.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 40
                  }
              },
              {
                  "name": "state_of_travel",
                  "title": "State_of_Travel",
                  "description": "For \"Travel and Lodging\" payments, the destination state where the covered recipient traveled.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 2
                  }
              },
              {
                  "name": "country_of_travel",
                  "title": "Country_of_Travel",
                  "description": "For \"Travel and Lodging\" payments, the destination country where the covered recipient traveled.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "physician_ownership_indicator",
                  "title": "Physician_Ownership_Indicator",
                  "description": "Indicates whether the physician holds an ownership or investment interest in the applicable manufacturer; this indicator is limited to physician's ownership, not the physician's family members' ownership",
                  "type": "string",
                  "constraints": {
                      "maxLength": 3
                  }
              },
              {
                  "name": "third_party_payment_recipient_indicator",
                  "title": "Third_Party_Payment_Recipient_Indicator",
                  "description": "Indicates if a payment or transfer of value was paid to a third party entity or individual at the request of or on behalf of a covered recipient (physician or teaching hospital).",
                  "type": "string",
                  "constraints": {
                      "maxLength": 50
                  }
              },
              {
                  "name": "name_of_third_party_entity_receiving_payment_or_transfer_of_ccfc",
                  "title": "Name_of_Third_Party_Entity_Receiving_Payment_or_Transfer_of_Value",
                  "description": "The name of the entity that received the payment or other transfer of value.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 50
                  }
              },
              {
                  "name": "charity_indicator",
                  "title": "Charity_Indicator",
                  "description": "Indicates the third party entity that received the payment or other transfer of value is a charity.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 3
                  }
              },
              {
                  "name": "third_party_equals_covered_recipient_indicator",
                  "title": "Third_Party_Equals_Covered_Recipient_Indicator",
                  "description": "An indicator showing the \"Third Party\" that received the payment or other transfer of value is a Covered Recipient.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 3
                  }
              },
              {
                  "name": "contextual_information",
                  "title": "Contextual_Information",
                  "description": "Any free String, which the reporting entity deems helpful or appropriate regarding this payment or other transfer of value.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 500
                  }
              },
              {
                  "name": "delay_in_publication_indicator",
                  "title": "Delay_in_Publication_Indicator",
                  "description": "An indicator showing if an Applicable Manufacturer\/GPO is requesting a delay in the publication of a payment or other transfer of value",
                  "type": "string",
                  "constraints": {
                      "maxLength": 3
                  }
              },
              {
                  "name": "record_id",
                  "title": "Record_ID",
                  "description": "System-assigned identifier to the general transaction at the time of submission",
                  "type": "string",
                  "constraints": {
                      "maxLength": 38,
                      "pattern": "^[0-9]+$"
                  }
              },
              {
                  "name": "dispute_status_for_publication",
                  "title": "Dispute_Status_for_Publication",
                  "description": "Indicates whether the payment or other transfer of value is disputed by the covered recipient or not",
                  "type": "string",
                  "constraints": {
                      "maxLength": 3
                  }
              },
              {
                  "name": "related_product_indicator",
                  "title": "Related_Product_Indicator",
                  "description": "The indicator allows the applicable manufacturer or applicable GPO to select whether the payment or other transfer of value is related to one or more product(s) (drugs, devices, biologicals, or medical supplies). If the payment was not made in relation to a product, select \"No\". If the payment was related to one or more products, select \"Yes\".",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "covered_or_noncovered_indicator_1",
                  "title": "Covered_or_Noncovered_Indicator_1",
                  "description": "Each product listed in relation to the payment or other transfer of value, indicates if the product is a covered or non-covered product per the covered product definition in the Open Payments final rule.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "indicate_drug_or_biological_or_device_or_medical_supply_1",
                  "title": "Indicate_Drug_or_Biological_or_Device_or_Medical_Supply_1",
                  "description": "Each product listed in relation to the payment or other transfer of value, indicates if the product is a drug, device, biological, or medical supply.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "product_category_or_therapeutic_area_1",
                  "title": "Product_Category_or_Therapeutic_Area_1",
                  "description": "Provide the product category or therapeutic area for the covered drug, device, biological, or medical supply listed in relation to the payment or other transfer of value.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "name_of_drug_or_biological_or_device_or_medical_supply_1",
                  "title": "Name_of_Drug_or_Biological_or_Device_or_Medical_Supply_1",
                  "description": "The marketed name of the drug, device, biological, or medical supply. May report the marketed name of up to five products (drugs, devices, biologicals, or medical supplies) associated with the payment or other transfer of value.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 500
                  }
              },
              {
                  "name": "associated_drug_or_biological_ndc_1",
                  "title": "Associated_Drug_or_Biological_NDC_1",
                  "description": "The National Drug Code, if any, of the drug or biological associated with the payment or other transfer of value (if applicable); the record may report up to 5 codes",
                  "type": "string",
                  "constraints": {
                      "maxLength": 12
                  }
              },
              {
                  "name": "associated_device_or_medical_supply_pdi_1",
                  "title": "Associated_Device_or_Medical_Supply_PDI_1",
                  "description": "The Primary Device Identifier, if any, of the covered device or covered medical supply associated with the payment or other transfer of values (if applicable); the record may report up to 5 codes.\nNote: OP Program began collecting PDI information during PY 2021.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "covered_or_noncovered_indicator_2",
                  "title": "Covered_or_Noncovered_Indicator_2",
                  "description": "For each product listed in relation to the payment or other transfer of value, indicates if the product is a covered or non- covered product per the covered product definition in the Open Payments final rule.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "indicate_drug_or_biological_or_device_or_medical_supply_2",
                  "title": "Indicate_Drug_or_Biological_or_Device_or_Medical_Supply_2",
                  "description": "For each product listed in relation to the payment or other transfer of value, indicates if the product is a drug, device, biological, or medical supply.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "product_category_or_therapeutic_area_2",
                  "title": "Product_Category_or_Therapeutic_Area_2",
                  "description": "Provide the product category or therapeutic area for the covered drug, device, biological, or medical supply listed in relation to the payment or other transfer of value.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "name_of_drug_or_biological_or_device_or_medical_supply_2",
                  "title": "Name_of_Drug_or_Biological_or_Device_or_Medical_Supply_2",
                  "description": "The marketed name of the drug, device, biological, or medical supply. May report the marketed name of up to five products (drugs, devices, biologicals, or medical supplies) associated with the payment or other transfer of value.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 500
                  }
              },
              {
                  "name": "associated_drug_or_biological_ndc_2",
                  "title": "Associated_Drug_or_Biological_NDC_2",
                  "description": "The National Drug Code, if any, of the drug or biological associated with the payment or other transfer of value (if applicable); the record may report up to 5 codes",
                  "type": "string",
                  "constraints": {
                      "maxLength": 12
                  }
              },
              {
                  "name": "associated_device_or_medical_supply_pdi_2",
                  "title": "Associated_Device_or_Medical_Supply_PDI_2",
                  "description": "The Primary Device Identifier, if any, of the covered device or covered medical supply associated with the payment or other transfer of values (if applicable); the record may report up to 5 codes.\nNote: OP Program began collecting PDI information during PY 2021.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "covered_or_noncovered_indicator_3",
                  "title": "Covered_or_Noncovered_Indicator_3",
                  "description": "For each product listed in relation to the payment or other transfer of value, indicates if the product is a covered or non- covered product per the covered product definition in the Open Payments final rule.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "indicate_drug_or_biological_or_device_or_medical_supply_3",
                  "title": "Indicate_Drug_or_Biological_or_Device_or_Medical_Supply_3",
                  "description": "For each product listed in relation to the payment or other transfer of value, indicates if the product is a drug, device, biological, or medical supply.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "product_category_or_therapeutic_area_3",
                  "title": "Product_Category_or_Therapeutic_Area_3",
                  "description": "Provide the product category or therapeutic area for the covered drug, device, biological, or medical supply listed in relation to the payment or other transfer of value.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "name_of_drug_or_biological_or_device_or_medical_supply_3",
                  "title": "Name_of_Drug_or_Biological_or_Device_or_Medical_Supply_3",
                  "description": "The marketed name of the drug, device, biological, or medical supply. May report the marketed name of up to five products (drugs, devices, biologicals, or medical supplies) associated with the payment or other transfer of value.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 500
                  }
              },
              {
                  "name": "associated_drug_or_biological_ndc_3",
                  "title": "Associated_Drug_or_Biological_NDC_3",
                  "description": "The National Drug Code, if any, of the drug or biological associated with the payment or other transfer of value (if applicable); the record may report up to 5 codes",
                  "type": "string",
                  "constraints": {
                      "maxLength": 12
                  }
              },
              {
                  "name": "associated_device_or_medical_supply_pdi_3",
                  "title": "Associated_Device_or_Medical_Supply_PDI_3",
                  "description": "The Primary Device Identifier, if any, of the covered device or covered medical supply associated with the payment or other transfer of values (if applicable); the record may report up to 5 codes.\nNote: OP Program began collecting PDI information during PY 2021.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "covered_or_noncovered_indicator_4",
                  "title": "Covered_or_Noncovered_Indicator_4",
                  "description": "For each product listed in relation to the payment or other transfer of value, indicates if the product is a covered or non- covered product per the covered product definition in the Open Payments final rule.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "indicate_drug_or_biological_or_device_or_medical_supply_4",
                  "title": "Indicate_Drug_or_Biological_or_Device_or_Medical_Supply_4",
                  "description": "For each product listed in relation to the payment or other transfer of value, indicates if the product is a drug, device, biological, or medical supply.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "product_category_or_therapeutic_area_4",
                  "title": "Product_Category_or_Therapeutic_Area_4",
                  "description": "Provide the product category or therapeutic area for the covered drug, device, biological, or medical supply listed in relation to the payment or other transfer of value.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "name_of_drug_or_biological_or_device_or_medical_supply_4",
                  "title": "Name_of_Drug_or_Biological_or_Device_or_Medical_Supply_4",
                  "description": "The marketed name of the drug, device, biological, or medical supply. May report the marketed name of up to five products (drugs, devices, biologicals, or medical supplies) associated with the payment or other transfer of value.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 500
                  }
              },
              {
                  "name": "associated_drug_or_biological_ndc_4",
                  "title": "Associated_Drug_or_Biological_NDC_4",
                  "description": "The National Drug Code, if any, of the drug or biological associated with the payment or other transfer of value (if applicable); the record may report up to 5 codes",
                  "type": "string",
                  "constraints": {
                      "maxLength": 12
                  }
              },
              {
                  "name": "associated_device_or_medical_supply_pdi_4",
                  "title": "Associated_Device_or_Medical_Supply_PDI_4",
                  "description": "The Primary Device Identifier, if any, of the covered device or covered medical supply associated with the payment or other transfer of values (if applicable); the record may report up to 5 codes.\nNote: OP Program began collecting PDI information during PY 2021.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "covered_or_noncovered_indicator_5",
                  "title": "Covered_or_Noncovered_Indicator_5",
                  "description": "For each product listed in relation to the payment or other transfer of value, indicates if the product is a covered or non- covered product per the covered product definition in the Open Payments final rule.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "indicate_drug_or_biological_or_device_or_medical_supply_5",
                  "title": "Indicate_Drug_or_Biological_or_Device_or_Medical_Supply_5",
                  "description": "For each product listed in relation to the payment or other transfer of value, indicates if the product is a drug, device, biological, or medical supply.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "product_category_or_therapeutic_area_5",
                  "title": "Product_Category_or_Therapeutic_Area_5",
                  "description": "Provide the product category or therapeutic area for the covered drug, device, biological, or medical supply listed in relation to the payment or other transfer of value.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "name_of_drug_or_biological_or_device_or_medical_supply_5",
                  "title": "Name_of_Drug_or_Biological_or_Device_or_Medical_Supply_5",
                  "description": "The marketed name of the drug, device, biological, or medical supply. May report the marketed name of up to five products (drugs, devices, biologicals, or medical supplies) associated with the payment or other transfer of value.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 500
                  }
              },
              {
                  "name": "associated_drug_or_biological_ndc_5",
                  "title": "Associated_Drug_or_Biological_NDC_5",
                  "description": "The National Drug Code, if any, of the drug or biological associated with the payment or other transfer of value (if applicable); the record may report up to 5 codes",
                  "type": "string",
                  "constraints": {
                      "maxLength": 12
                  }
              },
              {
                  "name": "associated_device_or_medical_supply_pdi_5",
                  "title": "Associated_Device_or_Medical_Supply_PDI_5",
                  "description": "The Primary Device Identifier, if any, of the covered device or covered medical supply associated with the payment or other transfer of values (if applicable); the record may report up to 5 codes.\nNote: OP Program began collecting PDI information during PY 2021.",
                  "type": "string",
                  "constraints": {
                      "maxLength": 100
                  }
              },
              {
                  "name": "program_year",
                  "title": "Program_Year",
                  "description": "The year in which the payment occurred, as reported by submitting entity.",
                  "type": "integer",
                  "constraints": {
                      "maximum": 9999
                  }
              },
              {
                  "name": "payment_publication_date",
                  "title": "Payment_Publication_Date",
                  "description": "The predefined date when the payment or other transfer of value is scheduled to be published",
                  "type": "date",
                  "format": "%m\/%d\/%Y"
              }
          ]
      }
  }

  useEffect(() => {
    if (distribution.identifier) {
      let localFileFormat = '';
      if (distribution.data.format) {
        localFileFormat = distribution.data.format.toUpperCase();
      } else if (distribution.data.mediaType) {
        const mediaType = distribution.data.mediaType.split('/');
        if (mediaType.length && mediaType[1]) {
          localFileFormat = mediaType[1].toUpperCase();
        }
      }
      if (localFileFormat === 'CSV') {
        resource.setResource(distribution.identifier);
        resource.setManual(false);
      }
    }
  }, [distribution]);

  useEffect(() => {
    if (title) {
      if (setDatasetTitle) {
        setDatasetTitle(title);
      }
    }
  }, [title]);

  const notFoundContent = (
    <div className="ds-u-padding-top--3">
      <h1 className="ds-title">Error: Dataset not found</h1>
      <p>
        We're sorry, but there is no dataset ID that matches your entry. You may have been directed
        here because:
      </p>
      <ol>
        <li>The address you typed contains a typo;</li>
        <li>The requested dataset no longer exists.</li>
      </ol>
      <p>
        <span className="ds-u-font-weight--bold">Note:</span> If you were using a bookmark, please
        reset it once you find the correct dataset.
      </p>
    </div>
  );
  
  return (
    <>
      {dataset.error ? (
        <PageNotFound content={notFoundContent} siteUrl={rootUrl} />
      ) : (
        <div className={'ds-l-container'}>
          <div className={'ds-l-row'}>
            <div className={'ds-l-md-col--9'}>
              <h1 className={'ds-h1 title-underline'}>{title}</h1>
            </div>
            <div className={'ds-l-md-col--12 ds-u-color--gray ds-u-margin-y--1 ds-u-text-align--right'}>
              <p className="ds-u-margin--0">Updated <TransformedDate date={dataset.modified} /></p>
            </div>
            <div className={'ds-l-md-col--9'}>
              <div className={'ds-u-measure--wide ds-u-margin-bottom--7'}>
                <p className="dc-c-metadata-description ds-u-margin--0" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(dataset.description) }}/>
              </div>
            </div>
          </div>
          <div className={'ds-l-row'}>
            <div className={'ds-l-md-col--12 dc-dataset'}>
              {distribution && distribution.data && (
                <Tabs
                  onChange={function noRefCheck() {}}
                  defaultSelectedId={window.location.hash.substring(1)}
                >
                  {distribution.data.format === "csv" && (
                    <TabPanel
                      id={'data-table'}
                      tab={
                        <span className="ds-u-color--primary">
                          <SearchItemIcon id="data-table" />
                          Data Table
                        </span>
                      }
                      className={ borderlessTabs ? 'ds-u-border--0 ds-u-padding-x--0' : '' }
                    >
                      <DatasetTable id={id} distribution={distribution} resource={resource} rootUrl={rootUrl} customColumns={customColumns} />
                    </TabPanel>
                  )}
                  <TabPanel
                    id={'overview'}
                    tab={
                      <span className="ds-u-color--primary">
                        <SearchItemIcon id="overview" />
                        Overview
                      </span>
                    }
                    className={ borderlessTabs ? 'ds-u-border--0 ds-u-padding-x--0' : '' }
                  >
                    <DatasetOverview resource={resource} dataset={dataset} distributions={distributions} metadataMapping={metadataMapping} />
                  </TabPanel>
                  {(datasetDictionary && datasetDictionary.data.fields.length) || (datasetSitewideDictionary && datasetSitewideDictionary.length) ? (
                    <TabPanel
                      id={'data-dictionary'}
                      tab={
                        <span className="ds-u-color--primary">
                          <SearchItemIcon id="data-dictionary" />
                          Data Dictionary
                        </span>
                      }
                      className={ borderlessTabs ? 'ds-u-border--0 ds-u-padding-x--0' : '' }
                    >
                      <DataDictionary datasetSitewideDictionary={datasetSitewideDictionary} datasetDictionary={datasetDictionary.data.fields} title={"Data Dictionary"} />
                    </TabPanel>
                  )
                  : null}
                  <TabPanel
                    id={'api'}
                    tab={
                      <span className="ds-u-color--primary">
                        <SearchItemIcon id="api" />
                        API
                      </span>
                    }
                    className={ borderlessTabs ? 'ds-u-border--0 ds-u-padding-x--0' : '' }
                  >
                    <DatasetAPI id={id} rootUrl={rootUrl} apiUrl={apiPageUrl} additionalParams={additionalParams} />
                  </TabPanel>
                </Tabs>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

Dataset.propTypes = {
  id: PropTypes.string.isRequired,
  rootUrl: PropTypes.string.isRequired,
};

export default withQueryProvider(Dataset);
