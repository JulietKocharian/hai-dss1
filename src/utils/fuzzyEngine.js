// src/utils/fuzzyEngine.js
export class FuzzyEngine {
    trapezoidal(x, [a,b,c,d]) {
        if(x <= a || x >= d) return 0;
        if(x >= b && x <= c) return 1;
        if(x > a && x < b) return (x-a)/(b-a);
        if(x > c && x < d) return (d-x)/(d-c);
        return 0;
    }

    fuzzify(crispValues, variables) {
        return variables.map((v, i) => 
            v.sets.map(set => this.trapezoidal(crispValues[i], set))
        );
    }

    applyRules(fuzzifiedInputs, inferences, outputLength) {
        const results = Array(outputLength).fill(0);
        inferences.forEach(rule => {
            // rule = [input0_set,input1_set,...,output_set]
            let degree = 1;
            for(let i=0; i<rule.length-1; i++) {
                degree = Math.min(degree, fuzzifiedInputs[i][rule[i]]);
            }
            results[rule[rule.length-1]] = Math.max(results[rule[rule.length-1]], degree);
        });
        return results;
    }

    defuzzify(outputSets, ruleResults) {
        let numerator=0, denominator=0;
        outputSets.forEach((set,i)=>{
            const centroid = (set[0]+set[1]+set[2]+set[3])/4;
            numerator += centroid * ruleResults[i];
            denominator += ruleResults[i];
        });
        return denominator>0 ? numerator/denominator : 50;
    }

    getResult(config) {
        const fuzzified = this.fuzzify(config.crisp_input, config.variables_input);
        const ruleResults = this.applyRules(fuzzified, config.inferences, config.variable_output.sets.length);
        return this.defuzzify(config.variable_output.sets, ruleResults);
    }
}
