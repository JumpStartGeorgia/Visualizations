#!/bin/bash

date=`date +%Y-%m-%d`
dir=/home/jason/Projects/visuals/greenspace/latest_shapes/shapes/$date

mkdir -p $dir

wget -O $dir/rz1.zip "http://geosrv2.tbilisi.gov.ge/geoserv/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=cite%3AFUNCTIONAL_ZONES&CQL_FILTER=LEB%20like%20%27rz-1%27&outputFormat=shape-zip&srsName=EPSG:4326"
wget -O $dir/rz2.zip "http://geosrv2.tbilisi.gov.ge/geoserv/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=cite%3AFUNCTIONAL_ZONES&CQL_FILTER=LEB%20like%20%27rz-2%27&outputFormat=shape-zip&srsName=EPSG:4326"
wget -O $dir/rz3.zip "http://geosrv2.tbilisi.gov.ge/geoserv/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=cite%3AFUNCTIONAL_ZONES&CQL_FILTER=LEB%20like%20%27rz-3%27&outputFormat=shape-zip&srsName=EPSG:4326"
wget -O $dir/lsz.zip "http://geosrv2.tbilisi.gov.ge/geoserv/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=cite%3AFUNCTIONAL_ZONES&CQL_FILTER=LEB%20like%20%27lsz%27&outputFormat=shape-zip&srsName=EPSG:4326"
wget -O $dir/satyeo.zip "http://geosrv2.tbilisi.gov.ge/geoserv/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=cite%3AFUNCTIONAL_ZONES&CQL_FILTER=LEB%20like%20%27satyeo%27&outputFormat=shape-zip&srsName=EPSG:4326"

