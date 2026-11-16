import { useCallback, useState } from 'react';
import { View } from 'react-native';

import { Chip, Muted } from '../components/ui';
import { SUBJECTS } from '../constants';
import { deleteStudent, listStudents } from '../services/api';
import PeopleListScreen from './PeopleListScreen';

export default function StudentsScreen({ navigation }) {
  const [subject, setSubject] = useState('');

  const loadPage = useCallback((page) => listStudents(page, 8, subject), [subject]);

  function escolherMateria(materia) {
    setSubject((atual) => (atual === materia ? '' : materia));
  }

  return (
    <PeopleListScreen
      key={subject || 'todas'}
      navigation={navigation}
      title="Alunos"
      newLabel="Novo aluno"
      emptyLabel="Nenhum aluno cadastrado."
      formRoute="StudentForm"
      loadPage={loadPage}
      removeItem={deleteStudent}
      itemLabel="aluno"
      subtitleFor={(item) => {
        const partes = [];
        if (item.enrollment) partes.push(`Matrícula ${item.enrollment}`);
        if (item.subject) partes.push(item.subject);
        return partes.join(' · ');
      }}
      headerExtra={
        <View style={{ marginTop: 12, marginBottom: 8 }}>
          <Muted>Turma por matéria</Muted>
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
