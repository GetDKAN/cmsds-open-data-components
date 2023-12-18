import { Link } from 'react-router-dom';

type LargeFileInfoProps = {
  className?: string;
};

const LargeFileInfo = (props: LargeFileInfoProps) => (
  <div className={props.className}>
    <p>
      Some datasets contain very large files and, depending on your network characteristics and
      software, may take a long time to download or fail to download. Additionally, the number of
      rows in the file may be larger than the maximum rows your version of Microsoft Excel supports.
      If you can't download the file, we recommend engaging your IT support staff. If you are able
      to download the file but are unable to open it in MS Excel or get a message that the data has
      been truncated, we recommend trying alternative programs such as MS Access, Universal Viewer,
      Editpad or any other software your organization has available for large datasets.
    </p>
    <p>
      <Link to="/about/software-specs-and-limits">
        Click here to learn more about software specifications and limits.
      </Link>
    </p>
  </div>
);

export default LargeFileInfo;
