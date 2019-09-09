import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator';


import style from './search.trace.module.scss';

const SIZE_PER_PAGE = 1;

const RemotePagination = ({
  data,
  page,
  sizePerPage,
  onTableChange,
  totalSize,
  columns,
  rowEvents,
}) => (
  <div>
    <PaginationProvider
      pagination={
        paginationFactory({
          custom: true,
          page,
          sizePerPage,
          totalSize,
        })
      }
    >
      {
        ({
          paginationProps,
          paginationTableProps,
        }) => (
          <div>
            <PaginationListStandalone
              {...paginationProps}
            />
            <BootstrapTable
              className={style.table}
              remote
              keyField="id"
              data={data}
              columns={columns}
              bordered={false}
              classes={style.table}
              {...paginationTableProps}
              onTableChange={onTableChange}
              rowEvents={rowEvents}
            />
          </div>
        )
      }
    </PaginationProvider>
  </div>
);


// eslint-disable-next-line no-undef
const { ipcRenderer } = window.require('electron');

class SearchTrace extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    hide: PropTypes.func,
  };

  static defaultProps = {
    hide: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      searching: false,

      input: {
        page: 0,
        sizePerPage: SIZE_PER_PAGE,
        search: null,
      },
      output: {
        results: [],
        total: 0,
      },
    };

    // ipc get files
    ipcRenderer.on('getIgcFilesResult', (event, arg) => {
      this.setState((pvSt) => ({
        ...pvSt,
        output: {
          results: arg.rows,
          total: arg.count,
        },
      }));
    });
  }

  componentDidMount() {
    ipcRenderer.send('getIgcFiles', this.state.input);
  }

  handleTableChange = (type, { page, sizePerPage }) => {
    if (type === 'pagination') {
      this.setState((pvSt) => ({
        ...pvSt,
        input: {
          ...pvSt.input,
          page: page - 1,
          sizePerPage,
        },
      }), () => {
        ipcRenderer.send('getIgcFiles', this.state.input);
      });
    }
  }

  render() {
    const { searching, output } = this.state;
    if (searching) {
      console.log('searching');
    }

    const { t } = this.props;
    const { results } = output;
    const columns = [{
      dataField: 'date',
      text: t('search_column_date'),
    }, {
      dataField: 'tag',
      text: t('search_column_tag'),
    }];

    const rowEvents = {
      onClick: (_e, row) => {
        ipcRenderer.send('getIgcById', {
          id: row.id,
        });
        this.props.hide();
      },
    };

    return (
      <RemotePagination
        data={results}
        page={this.state.input.page + 1}
        columns={columns}
        sizePerPage={this.state.input.sizePerPage}
        totalSize={this.state.output.total}
        onTableChange={this.handleTableChange}
        rowEvents={rowEvents}
      />
    );
  }
}

export default withTranslation()(SearchTrace);
