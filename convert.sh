#!/bin/bash
cd uploads
#echo $1;
today=`date '+%Y_%m_%d__%H_%M_%S'`;
filename=record-$today.wav;
ffmpeg -i $1.flac $filename;
soxi $filename;
sox $filename -r 16000 $1.wav;
soxi $1.wav;
rm $filename;
rm $1.flac;
cd ..