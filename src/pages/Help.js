import React, { Component } from 'react';
import '../App.css';
import './Help.css';

const optsImg = '/images/pqs_constraints.svg';

class Help extends Component {
    render(){
        return <div className="body">
        <div className="help-wrapper">
            <h1>About pqsfinder</h1>
                <p>The pqsfinder algorithm identifies DNA/RNA sequence patterns that are likely to fold into an intramolecular G-quadruplex (G4). G4 is a nucleic acid structure that can form as an alternative to the canonical structures. G4s are believed to be involved in regulation of diverse biological processes, such as telomere maintenance, DNA replication, chromatin formation, transcription, recombination or mutation (Maizels and Gray 2013; Kejnovsky, Tokan, and Lexa 2015).</p>
                
                <p>The algorithm first identifies four consecutive G-run sequences. Subsequently, it examines the potential of such G-runs to form a stable G4 and assigns a corresponding quantitative score to each. Non-overlapping potential quadruplex-forming sequences (PQS) with positive score are then reported.</p>

                <p>Unlike many other approaches, our algorithm is able to detect sequences responsible for G4s folded from imperfect G-runs containing bulges or mismatches and as such is more sensitive than competing algorithms. We have tested pqsfinder on experimentally verified G4 sequences. The results of that work are reflected in default settings of searches. Details of these tests are avaible in our paper <a href="https://dx.doi.org/10.1093/bioinformatics/btx413" target="_blank" rel="noopener noreferrer">Hon et al. 2017</a>. We also believe our solution is the most scalable, since it can be easily and quickly customized. The program can be made to detect novel or experimental G4 types that might be discovered or studied in future. See <a href="https://www.bioconductor.org/packages/release/bioc/vignettes/pqsfinder/inst/doc/pqsfinder.html" target="_blank" rel="noopener noreferrer">pqsfinder package user guide</a> for more details.</p>

                <p>For those interested in non-B DNA, we have previously authored a similar package that can be used to search for triplexes, another type of non-B DNA structure. For details, please see the <a href="https://bioconductor.org/packages/release/bioc/html/pqsfinder.html" target="_blank" rel="noopener noreferrer">triplex package</a>.</p>

                <h2>Result export</h2>

                <p>The pqsfinder results can be downloaded in CSV or GFF3 format. Besides the genomic coordinates and the pqsfinder score, both output formats contain columns describing the structure of each PQS. The description of the additional metadata is in the following table. These data can be easily used to extract the sequence of every PQS component (e.g. G-runs, loops and defects).</p>

                <table class="optsTable">
                <thead>
                <tr>
                    <td><strong>Name</strong></td>
                    <td><strong>Description</strong></td>
                </tr>
                </thead>
                <tr>
                    <td><strong>nt</strong></td>
                    <td>Number of G-tetrads</td>
                </tr>
                <tr>
                    <td><strong>nb</strong></td>
                    <td>Number of bulges</td>
                </tr>
                <tr>
                    <td><strong>nm</strong></td>
                    <td>Number of mismatches</td>
                </tr>
                <tr>
                    <td><strong>rl1</strong></td>
                    <td>Length of the first G-run</td>
                </tr>
                <tr>
                    <td><strong>rl2</strong></td>
                    <td>Length of the second G-run</td>
                </tr>
                <tr>
                    <td><strong>rl3</strong></td>
                    <td>Length of the third G-run</td>
                </tr>
                <tr>
                    <td><strong>ll1</strong></td>
                    <td>Length of the first loop</td>
                </tr>
                <tr>
                    <td><strong>ll2</strong></td>
                    <td>Length of the second loop</td>
                </tr>
                <tr>
                    <td><strong>ll3</strong></td>
                    <td>Length of the third loop</td>
                </tr>
                </table>

                <p>The result CSV files include predicted PQS structures in a human-readable format.<br/>
                <em>Example:</em> [GG(A)GG]TTTTT[GGGG]TTTTTTTT[GGGG]TTTTTTTT[GGaG]<br/>
                G-runs are in square brackets, bulges in round brackets and mismatches are in lower case.</p>

                <h2>Search options</h2>
                <p>Depending on the particular type of potential G-quadruplex sequence (PQS) you want to detect, the algorithm options can be tuned to find the PQS effectively and exclusively. The table bellow gives an overview of all basic algorithm options and their descriptions.</p>  

                <table className="optsTable">
                <thead>
                <tr>
                <td><strong>Option name</strong></td>
                <td><strong>Description</strong></td>
                </tr>
                </thead>
                <tbody>
                <tr class="odd">
                <td><strong>Maximum length</strong></td>
                <td>Maximal total length of PQS.</td>
                </tr>
                <tr class="even">
                <td><strong>Minimum score</strong></td>
                <td>Minimum PQS score.</td>
                </tr>
                <tr class="odd">
                <td><strong>Strand</strong></td>
                <td>Strand specification. Allowed values are '+', '-' or both strands.</td>
                </tr>
                <tr class="odd">
                <td><strong>Allowed defects</strong></td>
                <td>Maximum number of allowed defects in total.</td>
                </tr>
                <tr class="odd">
                <td><strong>Allowed bulges</strong></td>
                <td>Maximum number of G-runs containing a bulge.</td>
                </tr>
                <tr class="even">
                <td><strong>Allowed mismatches</strong></td>
                <td>Maximum number of G-runs containing a mismatch.</td>
                </tr>
                <tr class="odd">
                <td><strong>Minimum loop length</strong></td>
                <td>Minimum length of each inner loop. At most one loop can have zero length.</td>
                </tr>
                <tr class="even">
                <td><strong>Maximum loop length</strong></td>
                <td>Maximum length of each inner loop.</td>
                </tr>
                <tr class="odd">
                <td><strong>Minimum G-run length</strong></td>
                <td>Minimum length of each G-run.</td>
                </tr>
                <tr class="even">
                <td><strong>Maximum G-run length</strong></td>
                <td>Maxximum length of each G-run.</td>
                </tr>
                </tbody>
                </table>

                <p><img src={optsImg} alt="options explained" className="optsImg"></img></p>
                <p className="optsCaption"><strong>The structure of G-quadruplex sequence pattern.</strong> Each G4 pattern consists of four G-runs and three inner loops. The pqsfinder algorithm allows at most one type of defect (bulge or mismatch) in a G-run and at least one of the G-runs must be perfect (without any defect). Therefore the maximum numbers of allowed bulges, mismatches and defects must fall into the range from 0 to 3.</p>

                <h2>Scoring function</h2>
                <p>The pqsfinder scoring function quantitatively approximate the relationship between G4 sequence and the stability of its structure. The score is modular and, obtained by addition of scores representing the binding affinities of smaller regions within the G4. This kind of approach has already been proven to work for simpler DNA structures, such as nucleic acid duplexes and hairpins.</p>

                <p>The scoring is defined by following equation, where <em>N<sub>t</sub></em> is the number of tetrads, <em>B<sub>t</sub></em> is a G-tetrad stacking bonus, <em>N<sub>m</sub></em> is the number of inner mismatches, <em>P<sub>m</sub></em> is mismatch penalization, <em>N<sub>b</sub></em> is the number of bulges, <em>P<sub>b</sub></em> is bulge penalization, <em>F<sub>b</sub></em> is bulge length penalization factor, <em>L<sub>bi</sub></em> is the length of the i-th bulge and <em>E<sub>b</sub></em> is bulge length exponent.</p>

                <p className="equation"><em>S<sub>r</sub></em> = (<em>N<sub>t</sub></em> − 1) <em>B<sub>t</sub></em> − <em>N<sub>m</sub>P<sub>m</sub></em> − ∑<sub>i=1...<em>N<sub>b</sub></em></sub>(<em>P<sub>b</sub></em> + <em>F<sub>b</sub>L<sub>bi</sub><sup>Eb</sup></em>)</p>

                <p>The second part of the scoring scheme quantifies the destabilizing effect of the loops on G4 stability. We use empirical formula that can accommodate some of the observations made by Guédin et al. 2010. Complete scoring function is then expressed by the following equation, where <em>S<sub>r</sub></em> is the value from the previous equation, <em>L<sub>m</sub></em> is loop length mean, <em>F<sub>m</sub></em> is loop length mean penalization factor and <em>E<sub>m</sub></em> is loop length mean exponent.</p>
                
                <p className="equation"><em>S</em> = max(<em>S<sub>r</sub></em> − <em>F<sub>m</sub>L<sub>m</sub><sup>E<sub>m</sub></sup></em>, 0)</p>

                <p>The following table summarizes all scoring parameters and their default values.</p>

                <table class="optsTable">
                <thead>
                <tr>
                <td><strong>Parameter</strong></td>
                <td><strong>Description</strong></td>
                <td><strong>Default value</strong></td>
                </tr>
                </thead>
                <tbody>
                <tr class="odd">
                <td><em>B<sub>t</sub></em></td>
                <td>G-tetrad bonus, regardless the tetrade contains mismatch or not</td>
                <td>40</td>
                </tr>
                <tr class="even">
                <td><em>P<sub>m</sub></em></td>
                <td>Penalization for a mismatch in tetrad</td>
                <td>28</td>
                </tr>
                <tr class="odd">
                <td><em>P<sub>b</sub></em></td>
                <td>Penalization for a bulge</td>
                <td>20</td>
                </tr>
                <tr class="even">
                <td><em>F<sub>b</sub></em></td>
                <td>Penalization factor of a bulge length</td>
                <td>0.2</td>
                </tr>
                <tr class="odd">
                <td><em>E<sub>b</sub></em></td>
                <td>Exponent of a bulge length</td>
                <td>1</td>
                </tr>
                <tr class="even">
                <td><em>F<sub>m</sub></em></td>
                <td>Penalization factor of a loop length mean</td>
                <td>6.6</td>
                </tr>
                <tr class="odd">
                <td><em>E<sub>m</sub></em></td>
                <td>Exponent of a loop length mean</td>
                <td>0.8</td>
                </tr>
                </tbody>
                </table>

                <p>More details about the scoring function and about the method used for parameter optimization can be found in the main pqsfinder algorithm paper <a href="https://dx.doi.org/10.1093/bioinformatics/btx413" target="_blank" rel="noopener noreferrer">Hon et al. 2017</a>.</p>
            </div>
        </div>
    }
}

export default Help;