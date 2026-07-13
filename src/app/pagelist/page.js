'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HTable, Layout } from '@/components';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPages } from '@/store/pagesSlice';


export default function PageList() {
  const router = useRouter();
  const dispatch = useDispatch();
  const pages = useSelector((state) => state?.pages?.allPages) || [];

  const handleEdit = (route) => {
    router.push('/edit/'+route);
  };

  const headers = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'description', label: 'Description', sortable: false },
    {key: 'slug', label:'Path', sortable: true},
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  useEffect(() => {
    dispatch(fetchAllPages());
  }, [dispatch]);


  const data = pages.map(page => ({
    title: page.title,
    description: page.title,
    slug: page.slug,
    actions: (
      <IconButton onClick={() => handleEdit(page.slug)} color="primary">
        <EditIcon />
      </IconButton>
    )
  }));


  const handleSortRequested = ({ key, direction }) => {
    console.log('Sorting requested:', key, direction);
  };

  return (
    <Layout title={`General Pages`}>
       <HTable
          headers={headers}
          data={data}
          onSortRequested={handleSortRequested}
        />
    </Layout>
  );
}
