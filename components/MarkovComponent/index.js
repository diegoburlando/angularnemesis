import React, { Component } from "react";
import  "./styles.css";
import apiConfig from "../../apiconfiguration/apiconfig";
import PropTypes from "prop-types";
import { TrackState } from "../../state/tracker";


class Markov extends Component {
	static contextTypes = {store: PropTypes.object};
    constructor(props) {
        super(props);
        this.state = {
            theme : ""
        };
        
    }

    componentDidMount() {
        this.observeState();	        
        TrackState(this.context.store,"Markov");
        this.unsubscribe = this.context.store.subscribe(this.observeState);        
    }

    componentWillUnmount() {
		this.unsubscribe();		
	}

    observeState = () =>{ 
		this.setState({			
			theme:this.context.store.getState().theme			
		}); 		
	}
	componentWillMount() {
		window.scrollTo(0, 0);
    }
    
    
	
	render() {
		return (
            <div className = "markov-container">
                <div className = "markov-links-mobile">                    
                    <a href={apiConfig.maryMarkovNpm}>
                        <div className = "markov-images markov-npm"></div>
                    </a>                    
                    <a href = {apiConfig.maryMarkovGithub}>
                        <div className = "markov-images markov-git"></div>
                    </a>
                </div>
                <div className = "markov-links">
                    <p>Install the package from npmjs:</p>
                    <a href={apiConfig.maryMarkovNpm}>
                        <div className = "markov-images markov-npm"></div>
                    </a>
                    <p className = "markov-code" style={{width:'15em', margin: '0 auto', marginBottom: '1em'}}>npm i mary-markov</p>                    
                    <p>Check out the code on GitHub:</p>
                    <a href = {apiConfig.maryMarkovGithub}>
                        <div className = "markov-images markov-git"></div>
                    </a>
                </div>
                <div className = "markov-readme">
                    <h1 id="mary-markov">mary-markov</h1>
                    <h2 id="an-npm-package-to-calculate-probabilities-from-markov-chains-and-hidden-markov-models">An npm package to calculate probabilities from Markov Chains and Hidden Markov Models</h2>
                    <p className = "markov-code">const maryMarkov = require(&#39;mary-markov&#39;);  </p><h2 id="markov-chain">Markov Chain</h2>
                    <p>A simple Markov Chain requires states, transition probabilities and initial probabilities.</p>
                    <p>The states array must be an array of objects with the properties state and prob.</p>
                    <p>The prob property is an array representing the corresponding line of the matrix of the states&#39; transition probabilities.</p>
                    <p>For example, given a series of states <strong>S = &#123; &#39;sunny&#39;, &#39;cloudy&#39;, &#39;rainy&#39;&#125;</strong> the transition matrix would be: </p>
                    <div className = "markov-matrix-block">
                        <p className = "markov-code">  A = &nbsp;</p>
                        <p className = "markov-code">| 0.4 0.4 0.2 |<br/>| 0.3 0.3 0.4 |<br/>| 0.2 0.5 0.3 |</p>
                    </div>
                    <p>(represents the transition probabilities between the weather sunny, cloudy and rainy)</p>
                    <p>We&#39;d instantiate a series of states as such:  </p>
                    <p className = "markov-code">let states = [ <br/>
                        &emsp;&#123;state: &#39;sunny&#39;, prob:[0.4, 0.4, 0.2]&#125;, <br/>
                        &emsp;&#123;state: &#39;cloudy&#39;, prob:[0.3, 0.3, 0.4]&#125;, <br/>
                        &emsp;&#123;state: &#39;rainy&#39;, prob:[0.2, 0.5, 0.3]&#125; <br/>
                    ];</p>
                    <p>The initial probabilities of the states will be a simple array.
                    Each element of the array has the same index of the corresponding state in the states array.</p>
                    <p>Therefore, in this example, 0.4 is the sunny probability, 0.3 is the cloudy probability, and the final 0.3 is the rainy probability.</p>
                    <p className = "markov-code">let init = [0.4, 0.3, 0.3];</p><p>To instantiate the Markov Chain we pass the states, and the initial probabilities as parameters of the MarkovChain function.</p>
                    <p className = "markov-code">let markovChain = maryMarkov.MarkovChain(states, init);</p><h3 id="markov-chain-sequence-probability">Markov Chain sequence probability</h3>
                    <p>To then calculate the probability of a state sequence we call the sequenceProb() function on the object just instantiated, and we pass a state sequence array.</p>
                    <p className = "markov-code">let stateSeq = [&#39;sunny&#39;, &#39;rainy&#39;, &#39;sunny&#39;, &#39;sunny&#39;, &#39;cloudy&#39;]; <br/> 
                    let seqProbability = markovChain.sequenceProb(stateSeq); //0.002560000000000001</p>
                    <h3 id="markov-chain-properties">Markov Chain properties</h3>
                    <table>
                    <thead>
                    <tr>
                    <th>Property</th>
                    <th>Description</th>
                    </tr>
                    </thead>
                    <tbody><tr>
                    <td>states</td>
                    <td>Array of the names of the states</td>
                    </tr>
                    <tr>
                    <td>transMatrix</td>
                    <td>Array of arrays representing thetransition probabilities</td>
                    </tr>
                    <tr>
                    <td>initialProb</td>
                    <td>Array of initial probabilities</td>
                    </tr>
                    </tbody></table>
                    <p>Example:</p>
                    <p className = "markov-code">console.log(markovChain.transMatrix) // [ [ 0.4, 0.4, 0.2 ], [ 0.3, 0.3, 0.4 ], [ 0.2, 0.5, 0.3 ] ]</p><h2 id="hidden-markov-model">Hidden Markov Model</h2>
                    <p>A Hidden Markov Model requires hidden states, transition probabilities, observables, emission probabilities, and initial probabilities.</p>
                    <p>For example, given a series of states <strong>S = &#123; &#39;AT-rich&#39;, &#39;CG-rich&#39;&#125;</strong> the transition matrix would look like this:</p>
                    <div className = "markov-matrix-block">
                        <p className = "markov-code">  A = &nbsp;</p>
                        <p className = "markov-code">| 0.95 0.05 |<br/>| 0.1 &nbsp;0.9 &nbsp;|</p>
                    </div>
                    <p>(represents the transition probabilities between AT-rich and CG-rich segments in a DNA sequence)</p>
                    <p>In the program we&#39;d instantiate a series of hidden states as such:</p>
                    <p className = "markov-code">
                    let hiddenStates = [ <br/>
                        &emsp;&#123;state: &#39;AT-rich&#39;, prob: [0.95, 0.05]&#125;,   <br/>  
                        &emsp;&#123;state: &#39;CG-rich&#39;, prob: [0.1, 0.9]&#125;    <br/>  
                    ];</p>
                    <p>The hidden states array must be an array of objects with the properties state and prob.</p>
                    <p>The prob property is the array representing the corresponding line of the matrix of the hidden state.</p>
                    <p>The observables array is similar to the hiddenStates array.
                    Given a series of observables <strong>O = &#123; &#39;A&#39;, &#39;C&#39;, &#39;G&#39;, &#39;T&#39; &#125;</strong> the emission probabilities would be represented in the matrix:</p>
                    <div className = "markov-matrix-block">
                        <p className = "markov-code">  B = &nbsp;</p>
                        <p className = "markov-code">| 0.4 &nbsp;0.1&nbsp; 0.1&nbsp; 0.4&nbsp; |<br/>| 0.05 0.45 0.45 0.05 |</p>
                    </div>
                    <p>(represents the emission probabilities of the observables A, C, G, T given the hidden states AT-rich and CG-rich)</p>
                    <p>In the program the observables would be instantiated as:</p>
                    <p className = "markov-code">let observables = [  <br/>   
                        &emsp;&#123;obs: &#39;A&#39;, prob: [0.4, 0.05]&#125;,  <br/>  
                        &emsp;&#123;obs: &#39;C&#39;, prob: [0.1, 0.45]&#125;,   <br/>  
                        &emsp;&#123;obs: &#39;G&#39;, prob: [0.1, 0.45]&#125;,   <br/>  
                        &emsp;&#123;obs: &#39;T&#39;, prob: [0.4, 0.05]&#125;    <br/> 
                    ];</p>
                    <p>The initial probabilities of the hidden states will be a simple array.
                    Each element of the array has the same index of the corresponding hidden state in the hidden states array.</p>
                    <p className = "markov-code">let hiddenInit = [0.65, 0.35];</p><p>In this example, 0.65 is the AT-rich probability, and the final 0.35 is the CG-rich probability.</p>
                    <p>To instantiate the Hidden Markov Model we pass the states, the observables and the initial probabilities as parameters of the HMM function.</p>
                    <p className = "markov-code">let HMModel = maryMarkov.HMM(hiddenStates, observables, hiddenInit);</p><h3 id="hidden-markov-model-bayes-theorem">Hidden Markov Model: Bayes Theorem</h3>
                    <p>To calculate the probability of a specific hidden state given an observable we can call the bayesTheorem() function and pass two parameters: the observable and the hidden state of which we want to know the probability.  </p>
                    <p className = "markov-code">let observation = &#39;A&#39;;<br/> 
                    let hiddenState = &#39;AT-rich&#39;;<br/> 
                    let bayesResult = HMModel.bayesTheorem(observation, hiddenState); //0.9369369369369369</p><h3 id="hidden-markov-model-forward-algorithm-and-backward-algorithm-problem-1-likelihood-">Hidden Markov Model: Forward Algorithm and Backward Algorithm (Problem 1: Likelihood)</h3>
                    <p>To find the probability of an observation sequence given a model we can use either the forwardAlgorithm() function or the backwardAlgorithm() function and pass the observable sequence as parameter.</p>
                    <p>The forwardAlgorithm() function returns an object with:</p>
                    <ul>
                    <li>alphas : an array of arrays representing every forward probability of each state at every step of the sequence from start to end</li>
                    <li>alphaF : the final value of the Forward probability</li>
                    </ul>
                    <p>The backwardAlgorithm() function returns an object with:</p>
                    <ul>
                    <li>betas : an array of arrays representing every forward probability of each state at every step of the sequence from end to start</li>
                    <li>betaF : the final value of the Backward probability</li>
                    </ul>
                    <p>So,</p>
                    <p className = "markov-code">let obSequence = [&#39;T&#39;,&#39;C&#39;,&#39;G&#39;,&#39;G&#39;,&#39;A&#39;]; <br/> 

                    let forwardProbability = HMModel.forwardAlgorithm(obSequence);<br/> 
                    console.log(forwardProbability.alphaF); // 0.0003171642187500001<br/> <br/> 

                    let backwardProbability = HMModel.backwardAlgorithm(obSequence);<br/> 
                    console.log(backwardProbability.betaF); // 0.0003171642187500001</p><h3 id="hidden-markov-model-viterbi-algorithm-problem-2-decoding-">Hidden Markov Model: Viterbi Algorithm (Problem 2: Decoding)</h3>
                    <p>To calculate the most likely sequence of hidden states given a specific sequence of observables we can call the viterbiAlgorithm() function and pass it the observable sequence.</p>
                    <p className = "markov-code">let obSequence = [&#39;A&#39;, &#39;T&#39;, &#39;C&#39;, &#39;G&#39;, &#39;C&#39;, &#39;G&#39;, &#39;T&#39;, &#39;C&#39;, &#39;A&#39;, &#39;T&#39;, &#39;C&#39;, &#39;G&#39;, &#39;T&#39;, &#39;C&#39;, &#39;G&#39;, &#39;T&#39;, &#39;C&#39;, &#39;C&#39;, &#39;G&#39;];<br/>  
                    let viterbiResult = HMModel.viterbiAlgorithm(obSequence);</p><p>The viterbiAlgorithm() function returns an object with the following properties:</p>
                    <ul>
                    <li><p>states : the array of the hidden state sequence found</p>
                    </li>
                    <li><p>prob : the resulting highest probability of the states sequence</p>
                    </li>
                    <li><p>statesTrellis : an array of the trellis values of each state of the sequence. </p>
                    </li>
                    </ul>
                    <p>So, </p>
                    <p className = "markov-code">console.log(viterbiResult.states) //[ &#39;AT-rich&#39;, &#39;AT-rich&#39;, &#39;AT-rich&#39;, &#39;CG-rich&#39;, &#39;CG-rich&#39;, &#39;CG-rich&#39;, ... ] </p>
                    <h3 id="hidden-markov-model-baum-welch-algorithm-problem-3-learning-">Hidden Markov Model: Baum-Welch Algorithm (Problem 3: Learning)</h3>
                    <p>To adjust the model parameters (A,B,π) to maximize the probability of the observation sequence given the model λ, we use what is called the Baum-Welch algorithm, or forward-backward algorithm, a special case of the EM (Expectation-Maximization) algorithm.</p>
                    <p>The function in this package is called baumWelchAlgorithm() and requires an observation sequence as sole parameter.
                    This trains and adapts the current Hidden Markov Model and provides a new model λ&#39; = (A&#39;,B&#39;,π&#39;).</p>
                    <p className = "markov-code">let obSequence = [&#39;A&#39;, &#39;T&#39;, &#39;C&#39;, &#39;G&#39;, &#39;C&#39;, &#39;G&#39;, &#39;T&#39;, &#39;C&#39;, &#39;A&#39;, &#39;T&#39;, &#39;C&#39;, &#39;G&#39;, &#39;T&#39;, &#39;C&#39;, &#39;G&#39;, &#39;T&#39;, &#39;C&#39;, &#39;C&#39;, &#39;G&#39;]; <br/> 
                    let maximizedModel = HMModel.baumWelchAlgorithm(obSequence);</p>
                    <p>The function returns an HMM object with the initialProb, transMatrix, emissionMatrix properties updated with the values found by the algorithm.</p>
                    <p className = "markov-code">console.log(maximizedModel.transMatrix);  //[ [ 0.748722257770877, 0.251277742229123 ], [ 0.08173322039272721, 0.9182667796072727 ] ]</p>
                    <h3 id="hidden-markov-model-properties">Hidden Markov Model properties</h3>
                    <table>
                    <thead>
                    <tr>
                    <th>Property</th>
                    <th>Description</th>
                    </tr>
                    </thead>
                    <tbody><tr>
                    <td>states</td>
                    <td>Array of the names of the states</td>
                    </tr>
                    <tr>
                    <td>transMatrix</td>
                    <td>Array of arrays representing the transition probabilities</td>
                    </tr>
                    <tr>
                    <td>initialProb</td>
                    <td>Array of initial probabilities</td>
                    </tr>
                    <tr>
                    <td>observables</td>
                    <td>Array of the names of the observables</td>
                    </tr>
                    <tr>
                    <td>emissionMatrix</td>
                    <td>Array of arrays representing the emission probabilities</td>
                    </tr>
                    </tbody></table>
                    <p>Example:</p>
                    <p className = "markov-code">console.log(HMModel.transMatrix) // [ [ 0.95, 0.05 ], [ 0.1, 0.9 ] ]</p>
                               
                </div>
            </div>
		);
	}
}
export default Markov;