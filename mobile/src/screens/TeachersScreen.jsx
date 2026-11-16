import { useCallback, useState } from 'react';
import { View } from 'react-native';

import { Chip, Muted } from '../components/ui';
import { SUBJECTS } from '../constants';
import { deleteTeacher, listTeachers } from '../services/api';
import PeopleListScreen from './PeopleListScreen';

export default function TeachersScreen({ navigation }) {
  const [subject, setSubject] = useState('');

  const loadPage = useCallback((page) => listTeachers(page, 8, subject), [subject]);

  function escolherMateria(materia) {
    setSubject((atual) => (atual === materia ? '' : materia));
  }

  return (
    <PeopleListScreen
      key={subject || 'todas'}
      navigation={navigation}
      title="Professores"
      newLabel="Novo professor"
      emptyLabel="Nenhum professor cadastrado."
      formRoute="TeacherForm"
      loadPage={loadPage}
      removeItem={deleteTeacher}
      itemLabel="professor"
      tagsFor={(item) => item.subjects}
      headerExtra={
        <View style={{ marginTop: 12, marginBottom: 8 }}>
          <Muted>Matérias que lecionam</Muted>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
            <Chip label="Todas" selected={!subject} onPress={() => setSubject('')} />
            {SUBJECTS.map((materia) => (
              <Chip
                key={materia}
                label={materia}
                selected={subject === materia}
                onPress={() => escolherMateria(materia)}
              />
            ))}
          </View>
        </View>
      }
    />
  );
}
