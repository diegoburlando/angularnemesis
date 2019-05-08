const SWAP = (vec, i1,i11) => { let temp = vec[i11]; vec[i11] = vec[i1]; vec[i1] = temp; };
const  FFT = (vector,fftsize, sign) => {
	let n = 0, mmax = 0, m = 0, j = 0, istep = 0, i = 0;
	let wtemp = 0,wr = 0,wpr = 0,wpi = 0,wi = 0,theta = 0,tempr = 0,tempi = 0;
	n = fftsize << 1;
	for (i = 0; i < n/2; i+=2) {
			if (j > i) {
				SWAP(vector,j,i); SWAP(vector,j+1,i+1);
				if((j/2)<(n/4)){ SWAP(vector,(n-(i+2)),(n-(j+2))); SWAP(vector,(n-(i+2))+1,(n-(j+2))+1);}
			}
			m = n >> 1;
			while (m >= 2 && j >= m) {j -= m;m >>= 1;}
			j += m;
		}	
		mmax = 2;
		while (n > mmax) {
			istep = mmax << 1;
			theta= sign * (2 * Math.PI/mmax);
			wtemp = Math.sin(0.5 * theta);wpr = -2.0 * wtemp * wtemp;wpi = Math.sin(theta); wr = 1.0; wi = 0.0;
			for (m=1;m<mmax;m+=2) {
				for (i=m;i<=n;i+=istep) {
					j=i+mmax;
					tempr=wr*vector[j-1]-wi*vector[j];
					tempi=wr*vector[j]+wi*vector[j-1];
					vector[j-1]=vector[i-1]-tempr;
					vector[j]=vector[i]-tempi;
					vector[i-1] += tempr;
					vector[i] += tempi;
				}
				wr=(wtemp=wr)*wpr-wi*wpi+wr;
				wi=wi*wpr+wtemp*wpi+wi;
			}
			mmax = istep;
		}
		if (sign == -1) { for (i=0; i<n; i++) vector[i] /= fftsize; }
}

const WrapFFT = ( fftsize,  signalArray, sign ) => {
	let m_vector = Array(2 * fftsize).fill(0);
	for(let n = 0; n < fftsize; n++)
	{
		if(n < signalArray.length) m_vector[2 * n] = signalArray[n]; //we fill the pairs 2,4,6,8,10
		else m_vector[2 * n] = 0; //the remaining are filled with zeros 
		m_vector[2 * n + 1] = 0; // the odds are the imaginary part and must be initialized to zero
	}		
	FFT(m_vector, fftsize, sign);		
	return m_vector;
}


const _performFft = (rawAudio) => {    
        //let btc = fs.readFileSync( __dirname + '/uploads/test.wav');           
        //let rawAudio = new Int16Array(btc.buffer, 44, Math.floor((btc.buffer.byteLength / 2 ) - 22));
        let dataForFft = rawAudio;        
        let counter = 2;let resFft = 0; 
        let properFttSize = () =>   { let base = 2;                                  
                                      while(true) 
                                      {
                                           resFft = Math.pow(base, counter);
                                           if (resFft >= dataForFft.length) break; 
                                           counter ++;
                                           properFttSize();
                                      }
                                      return resFft;
                                    };
                                    let fftSize = properFttSize();
        let datafft = WrapFFT(fftSize,dataForFft,1);
        let re = 0,im = 0;
        let FftDataCorrected = {x:[], y:[]};
        for(let i = 0 ; i < (datafft.length /  2) - 1; i++)
        {
            re = datafft[2*i];
            im = datafft[2*i+1];       
            FftDataCorrected.x.push(i * 16000 / fftSize );
            FftDataCorrected.y.push((Math.sqrt((re * re) + (im * im))));
        }
        return FftDataCorrected;
};


module.exports = {   
	performFft:_performFft,

};