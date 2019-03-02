import React, { Component } from 'react';
import scraperMain from '../utilities/scraper';

export default class ImageGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: []
    };
  }

  formatDateFromMs(ms) {
    const date = new Date(ms);
    let hours = date.getHours();
    let minutes = date.getMinutes();

    hours = hours ? hours : 12; // Hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes; // 0-pad the single digits

    const strTime = `${hours}:${minutes}`;

    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}  ${strTime}`;
  }

  sortImages(images) {
    // Sort images by the upload date
    const sortedImages = images.sort((a, b) => {
      const aDate = new Date(a.data.uploadDate);
      const bDate = new Date(b.data.uploadDate);
      return bDate - aDate;
    });

    this.setState({ images: sortedImages });
  }

  render() {
    const buildImage = imageData => {
      const { gridName, responsiveUrl, uploadDate, captureDate } = imageData.data;
      const { model, make } = imageData.data.imageMeta
        ? imageData.data.imageMeta
        : { model: "Undefined phone", make: "a company not specified" };

      return (
        <div className="image-container">
          <img
            className="image"
            src={`https://${responsiveUrl}`}
            onClick={() => {
              this.props.switchModalSource(`https://${responsiveUrl}`);
              this.props.modalToggle("image", "open")
            }}
          />
          <div className="info-container">
            <span className="info-text">{gridName}</span>
            <span className="info-text">{`Uploaded ${this.formatDateFromMs(uploadDate)}`}</span>
            {/* <span className="info-text">{`Capture date: ${this.formatDateFromMs(captureDate)}`}</span> */}
            <span className="info-text">{`Camera: ${model} from ${make}`}</span>
          </div>
        </div>
      );
    };

    return (
      <div className="grid-container scrollbar">
        <div id="imagegrid" className="imagegrid">
          {this.state.images.map(data => buildImage(data))}
        </div>
      </div>
    );
  }

  componentDidMount() {
    let totalData = [];
    scraperMain((data, totalAwaited) => {
      totalData = totalData.concat(data);
      if (totalData.length === totalAwaited) {
        this.sortImages(totalData);
      }
    });
  }
}