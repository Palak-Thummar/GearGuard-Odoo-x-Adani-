# -*- coding: utf-8 -*-
{
    'name': 'GearGuard Maintenance',
    'version': '1.0.0',
    'summary': 'Track equipment and maintenance requests with teams and calendar',
    'author': 'GearGuard',
    'category': 'Operations/Maintenance',
    'website': 'https://example.com',
    'depends': ['base', 'mail', 'hr'],
    'data': [
        'security/ir.model.access.csv',
        'data/request_stages.xml',
        'data/request_sequence.xml',
        'views/menus.xml',
        'views/team_views.xml',
        'views/equipment_views.xml',
        'views/request_views.xml',
    ],
    'application': True,
    'installable': True,
    'license': 'LGPL-3',
}
