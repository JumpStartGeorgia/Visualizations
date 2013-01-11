select d.value, left(d.en_common_name, instr(d.en_common_name, '-')-1)  as district, d.en_common_id as precinct
from
indicators as i
inner join data as d on d.indicator_id = i.id
where
i.event_id = 31
and i.shape_type_id in (4,8)
and i.core_indicator_id = 20
and d.data_set_id = 33
order by d.en_common_name
