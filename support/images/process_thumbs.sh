#! /bin/bash
mkdir pokes
mogrify -path pokes -format png scans/*.jpg

mkdir -p thumbs && mogrify -path thumbs -resize x100 -format png pokes/*.png

aws s3 cp pokes s3://poketrade/pokes --recursive
aws s3 cp thumbs s3://poketrade/thumbs --recursive