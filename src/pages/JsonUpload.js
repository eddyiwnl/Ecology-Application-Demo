import { Link } from "react-router-dom";
import jsonData from '../model_outputs/test_output.json'

// var testJson = require('../model_outputs/test_output.json')

// for (var i = 0; i < testJson.length; i++)
// {
//     var obj = testJson[i];
//     console.log(`Name: ${obj.pred_boxes}`);
// }

const JsonUpload = () => {
    const loadData = () => JSON.parse(JSON.stringify(jsonData));
    console.log(loadData)
    console.log(jsonData)
    var testJson = require('../model_outputs/test_output.json')
    console.log(testJson)
    console.log(testJson["M12_2_Apr19_3.jpg"].predictions.pred_boxes[0])

    console.log(testJson["M12_2_Apr19_3.jpg"].predictions.pred_boxes)
    for (var i = 0; i < testJson["M12_2_Apr19_3.jpg"].predictions.pred_boxes.length; i++)
    {
        console.log(i)
        var obj = testJson["M12_2_Apr19_3.jpg"].predictions.pred_boxes
        // console.log(`Name: ${obj[i]}`);
        console.log(obj[i]);
    }
    return (
        <section className='section'>
            <h2>JsonUpload</h2>
            <Link to='/' className='btn'>
                Home
            </Link>
        </section>
    );
};

export default JsonUpload