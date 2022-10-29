export class CosineSimilarity {
    static termFreqMap(str:string) {
        var words = str.split(' ');
        var termFreq:any = {};
        words.forEach((w) => {
            termFreq[w] = (termFreq[w] || 0) + 1;
        });
        return termFreq;
    }

    static addKeysToDict(map:any, dict:any) {
        for (var key in map) {
            dict[key] = true;
        }
    }

    static termFreqMapToVector(map:any, dict:any) {
        var termFreqVector = [];
        for (var term in dict) {
            termFreqVector.push(map[term] || 0);
        }
        return termFreqVector;
    }

    static vecDotProduct(vecA:any, vecB:any) {
        var product = 0;
        for (var i = 0; i < vecA.length; i++) {
            product += vecA[i] * vecB[i];
        }
        return product;
    }

    static vecMagnitude(vec:any) {
        var sum = 0;
        for (var i = 0; i < vec.length; i++) {
            sum += vec[i] * vec[i];
        }
        return Math.sqrt(sum);
    }

    static cosineSimilarity(vecA:any, vecB:any) {
        return this.vecDotProduct(vecA, vecB) / (this.vecMagnitude(vecA) * this.vecMagnitude(vecB));
    }

    public static textCosineSimilarity(strA:string, strB:string) {
        var termFreqA = this.termFreqMap(strA);
        var termFreqB = this.termFreqMap(strB);

        var dict = {};
        this.addKeysToDict(termFreqA, dict);
        this.addKeysToDict(termFreqB, dict);

        var termFreqVecA = this.termFreqMapToVector(termFreqA, dict);
        var termFreqVecB = this.termFreqMapToVector(termFreqB, dict);
        const result = this.cosineSimilarity(termFreqVecA, termFreqVecB);
        //console.log("::cosineSim::", result, "::for words::",strA," & ", strB);
        return result;
    }
}