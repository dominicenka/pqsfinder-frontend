import React, { Component } from 'react';
import '../App.css';
import './Examples.css';

class Examples extends Component {
    render(){
        return <div className="examples-wrapper">
                <h1>Genome Tracks</h1>

                    <p>Here you can find several whole-genome tracks of all potential G-quadruplex sequences (PQS) predicted by pqsfinder. All tracks were computed using pqsfinder v2.0.1 with default algorithm options.</p>

                    <h2>Human genome, release GRCh38 (hg38)</h2>

                <ul>
                    <li><a href="hub/hg38/pqsfinder_hg38.gff">GFF3</a> (132 MB), <a href="hub/hg38/pqsfinder_hg38_gff.tar.gz">GFF3.tar.gz</a> (20 MB) - includes full PQS metadata: number of tetrads, bulges and mismatches, run lengths and loop lengths. </li>
                    <li><a href="hub/hg38/pqsfinder_hg38.bed">BED</a> (40 MB), <a href="hub/hg38/pqsfinder_hg38_bed.tar.gz">BED.tar.gz</a> (11 MB) </li>
                </ul>

                <h2>Human genome, release GRCh19 (hg19)</h2>

                <ul>
                    <li><a href="hub/hg19/pqsfinder_hg19.gff">GFF3</a> (131 MB), <a href="hub/hg19/pqsfinder_hg19_gff.tar.gz">GFF3.tar.gz</a> (20 MB) - includes full PQS metadata: number of tetrads, bulges and mismatches, run lengths and loop lengths. </li>
                    <li><a href="hub/hg19/pqsfinder_hg19.bed">BED</a> (40 MB), <a href="hub/hg19/pqsfinder_hg19_bed.tar.gz">BED.tar.gz</a> (11 MB) </li>
                </ul>

                <h2>Visualize in UCSC Genome Browser</h2>

                <p>All tracks can be easily visualized using <a href="https://genome.ucsc.edu/">UCSC Genome Browser</a>. Just add the following hub URL using My Data / Track Hubs:</p>

                <pre>
                     https://pqsfinder.fi.muni.cz/hub/hub.txt
                </pre>

                <p>This hub contains four tracks for each human genome assembly (hg38, hg19):</p>

                <ul>
                    <li><strong>PQS</strong> - Potential G-quadruplex sequences predicted by pqsfinder </li>
                    <li><strong>PQS scores</strong> - Scores of potential G-quadruplex sequences predicted by pqsfinder (both strands) - this score represents the maximum from + and - strand. </li>
                    <li><strong>PQS scores (+)</strong> - Scores of potential G-quadruplex sequences predicted by pqsfinder (+ strand) </li>
                    <li><strong>PQS scores (-)</strong> - Scores of potential G-quadruplex sequences predicted by pqsfinder (- strand) </li>
                </ul>
        </div>
    }
}

export default Examples;