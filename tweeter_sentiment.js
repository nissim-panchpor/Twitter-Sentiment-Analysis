'use strict';  //treat silly mistakes as run-time errors

function tokenizeTweets(text){
    /*
       This function returns a list of lowercase words in the input string which contain more than 1 letters
    */
    var res = text.split(/\W+/);
    var res_reduced = res.filter(function(a){return a.length>1;}).map(function(b){return b.toLowerCase();});
    return(res_reduced);
}


function filterByEmotion(words, emotion){
     /*
       Filters a list of the words to get only those words that contain a specific emotion
    */
    var filtered_emotion_words = [];
    words.forEach(function(word) {
        if(SENTIMENTS[word] != undefined)
            if(SENTIMENTS[word][emotion] == 1)
                filtered_emotion_words.push(word);
    });

    return(filtered_emotion_words)

}


function wordsEachEmotion(words){
     /*
       Determines which words from a list have each emotion from a given list of EMOTIONS
    */
    var emo_words_obj = {};
    EMOTIONS.forEach(function(emotion){
        //console.log(emotion);
        var emotion_words = filterByEmotion(words , emotion);
        emo_words_obj[emotion] = emotion_words;
    });
    return(emo_words_obj);

}


function getCommonWords(words){
    /*
       Returns a list of the "most common" words in a list: each individual word in the input list ordered by how many times it appears in that list
    */
    var words_frequency = {};

    words.forEach(function(word) { words_frequency[word] = 0; });

    var uniques = words.filter(function(word) {
        return ++words_frequency[word] == 1;
    });

    return uniques.sort(function(i, j) {
        return words_frequency[j] - words_frequency[i];
    });
}


function analyzeTweets(tweettext){
    /*
     This function takes as input an array of tweets and returns array of objects containing emotion, percentage of words for that emotion, most common words for that emotion and most common hashtags for that emotion across all tweets that have that particular emotion
     */

    //for each tweet object, add an array of words and object of emotional words
    
    tweettext.forEach(function(a){a['words']=tokenizeTweets(a['text']);
    });

    tweettext.forEach(function(a){a['emo_words']=wordsEachEmotion(a['words']);
    });

    var analysis_tweets=[];

    //for each tweet store emotion, percentage of words, example words and hashtags
    for(var i=0;i<EMOTIONS.length;i++){
        //find the number of total words and emotional words in each tweet for each emotion
        var total_word_count=tweettext.map(function(a){return a['words'].length;});
        var emo_word_count=tweettext.map(function(a){if(a['emo_words'][EMOTIONS[i]]!=undefined)return a['emo_words'][EMOTIONS[i]].length; else{return 0;}});
        //find the percentage of emotional words for each emotion
        var percent_words= (emo_word_count.reduce(function(a,b){return a+b;}) / total_word_count.reduce(function(a,b){return a+b;}))*100; 
     
        //find the most common words which have the emotion   
        var example_words=tweettext.map(function(a){return filterByEmotion(a['words'],EMOTIONS[i]) ; });
        var example_words=getCommonWords(example_words.reduce(function(a,b){return a.concat(b);}));

        //find the most common hashtags across tweets associated with the emotion
        var hashlist=tweettext.map(function(a){return a.entities.hashtags;});
        var hashmap=[];
        for(var a=0;a<hashlist.length;a++)
            if(filterByEmotion(tokenizeTweets(tweettext[a]['text']),EMOTIONS[i]).length>0)
                for(var b=0;b<hashlist[a].length;b++)
                    hashmap.push(hashlist[a][b]['text']);
                    
        hashmap=getCommonWords(hashmap);
        
        //add the created object to array analysis_tweets
        analysis_tweets.push({'EMOTION':EMOTIONS[i],'PERC':percent_words,'EXAMPLE WORDS':example_words,'HASHTAGS':hashmap});
    }

    //Sort the array analysis_tweets based on percetage of words in descending order
    analysis_tweets=analysis_tweets.sort(function(a, b) {return parseFloat(b.PERC) - parseFloat(a.PERC);});
    
    return(analysis_tweets);
}


function showEmotionData(analysis_tweets){
    /*
     This function takes an array of objects as input and prints out table with twitter stats
     */
    //get a reference for body of the table
    var my_table=d3.select('#emotionsTable');
    my_table.html('');
    //For each twitter stat of each emotion, print on a table row
    for(var i=0;i<analysis_tweets.length;i++){
        var my_row=my_table.append('tr');
        my_row.html('<td>'+analysis_tweets[i]['EMOTION']+'</td><td>'+analysis_tweets[i]['PERC'].toFixed(2)+'%</td><td>'+analysis_tweets[i]['EXAMPLE WORDS'].slice(0,3).map(function(a){return ' '+a;})+'</td><td>'+analysis_tweets[i]['HASHTAGS'].slice(0,3).map(function(a){return '#'+a+' ';})+'</td>')
    }
}

function loadTweets(username){
    /*
     this function takes twitter username as input and calls functions to analyze the corresponding twitter data and display it
     */

    //create a url string with API and username
    var url='https://faculty.washington.edu/joelross/proxy/twitter/timeline/'+'?screen_name='+username+'&count=300';   
    //send an AJAX request to the API, analyze tweets and display the analysis after getting the response
    d3.json(url,function(a){showEmotionData(analyzeTweets(a));});
    
}

//create an anonymous function readUserInput which reads the username entered by user on webpage and anlayzes the tweets and displays results
var readUserInput=function(){
    var username=d3.select('#searchBox').property('value');         //read if user has entered username
    
    if(username=='SAMPLE_TWEETS')
        showEmotionData(analyzeTweets(SAMPLE_TWEETS));
    else
        loadTweets(username);
}

showEmotionData(analyzeTweets(SAMPLE_TWEETS));
//event on click of button and calls the readUserInput to get username
d3.select('#searchButton').on('click',readUserInput);